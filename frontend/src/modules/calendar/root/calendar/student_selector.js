// @flow

import { section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import component, { Component } from '../../../../core/component';

class StudentSelector extends Component {
    async refresh(groupId, studentsList) {
        this.state = {
            groupId: groupId,
            studentsList: studentsList ?? [],
        };
        this.updateView(await this.render());
    }

    async setStudent(id) {
        if (window.sessionStorage) {
            const storedId = window.sessionStorage.getItem('calendarStudentID') ?? -1;

            // dont bother setting and refreshing everything
            // if we've selected the same student.
            if (storedId == id) {
                return;
            }
        }

        window.sessionStorage.setItem('calendarStudentID', id);
        
        this.emit('RefreshCalendarView');
        this.emit('RefreshCalendarController');
    }

    async render() {
        const { groupId } = this.state;
        if (!groupId) {
            return p('no group selected');
        }

        const studentsList = this.state.studentsList;

        const students = [];
        for (const student of studentsList) {
            const studentId = student.id;

            // cache this in local storage or something?
            students.push(await window.beaconingAPI.getStudent(studentId));
        }

        const studentLinks = [];
        for (const student of students) {
            studentLinks.push(
                li(span('.fake-link',
                    {
                        onclick: () => {
                            this.setStudent(student.id);
                        },
                    },
                    student.username
                )),
            );
        }

        let studentSet = p('no students for this group.');
        if (studentLinks.length > 0) {
            studentSet = ul(studentLinks);
        }

        return div('.full-width',
            h2('Inspect student:'),
            studentSet);
    }
}

class StudentGroupSelector extends Component {
    state = {
        groupId: 0,
    };
    
    async render() {
        let options = [];
        
        const groups = Object.values(await window.beaconingAPI.getGroups()) ?? [];

        for (const group of groups) {
            let isSelected = '';
            if (this.state.groupId == group.id) {
                isSelected = 'selected';
            }
            
            options.push(
                option(isSelected, {
                    value: `${group.id}`,
                    students: group.students,
                }, `${group.name}`)
            );
        }

        const studentSel = new StudentSelector();

        return Promise.all([
            studentSel.attach(),
        ]).then((values) => {
            const [
                studentSelEl
            ] = values;

            return div('.group-select', 
                h2('Select group:'),
                select({
                    onchange: (event) => {
                        const self = event.target;
                        const selectedOption = self.options[self.selectedIndex];
                        const groupId = selectedOption.value;
                        studentSel.refresh(groupId, selectedOption.students);
                    },
                }, options), 
                studentSelEl);
        });
    }
}

export class SelectorPanel extends Component {
    async render() {
        const studentGroupSelector = new StudentGroupSelector();

        return Promise.all([
            studentGroupSelector.attach(),
        ]).then(((values) => {
            const [
                studentGroupSelEl
            ] = values;
            return section('.full-width', studentGroupSelEl);
        }));
    }
}