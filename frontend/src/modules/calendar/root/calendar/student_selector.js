// @flow

import { label, section, h1, h2, p, div, a, ul, li, span, select, option } from '../../../../core/html';
import component, { Component } from '../../../../core/component';
class StudentSelector extends Component {
    async refresh(groupId, studentsList) {
        this.state = {
            groupId: groupId,
            studentsList: studentsList ?? [],
        };
        this.updateView(await this.render());
    }

    async init() {
        const storedId = window.sessionStorage.getItem('calendarStudentID') ?? -1;
        if (storedId != -1) {
            this.setStudent(storedId);
        }
    }

    async setStudent(id) {
        console.log(`[Calendar] Setting student to ${id}`);

        if (window.sessionStorage) {
            const storedId = window.sessionStorage.getItem('calendarStudentID') ?? -1;

            // dont bother setting and refreshing everything
            // if we've selected the same student.
            if (storedId == id) {
                return;
            }
        }

        window.sessionStorage.setItem('calendarStudentID', id);
        
        this.emit('RefreshCalendarController');
        this.emit('RefreshCalendarView');
    }

    async render() {
        const { groupId } = this.state;
        if (!groupId) {
            return p(await window.bcnI18n.getPhrase('cal_no_group_selected'));
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
            let studentName = student.username;
            if (student.profile.firstName) {
                studentName += `, ${student.profile.firstName} ${student.profile.lastName}`;
            }

            studentLinks.push(
                li(span('.fake-link',
                    {
                        onclick: () => {
                            this.setStudent(student.id);
                        },
                    },
                    studentName,
                )),
            );
        }

        const no_students_transl = await window.bcnI18n.getPhrase('cal_no_students_for_this_group');

        let studentSet = p(no_students_transl);
        if (studentLinks.length > 0) {
            studentSet = ul(studentLinks);
        }

        const cal_inspect_student = await window.bcnI18n.getPhrase('cal_inspect_student');

        return div('.full-width',
            h2(`${cal_inspect_student}:`),
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
                label('.select', select('#so-class-list', {
                    onchange: (event) => {
                        const self = event.target;
                        const selectedOption = self.options[self.selectedIndex];
                        const groupId = selectedOption.value;
                        studentSel.refresh(groupId, selectedOption.students);
                    },
                }, options)), 
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