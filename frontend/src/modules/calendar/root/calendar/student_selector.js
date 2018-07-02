// @flow
import { label, section, h2, p, div, ul, li, span, select, option } from '../../../../core/html';
import { Component } from '../../../../core/component';
import nullishCheck from '../../../../core/util';

class StudentSelector extends Component {
    async refresh(groupId, studentsList) {
        this.state = {
            groupId,
            studentsList: nullishCheck(studentsList, []),
        };
        this.updateView(await this.render());
    }

    async init() {
        const storedId = nullishCheck(window.sessionStorage.getItem('calendarStudentID'), 'none');
        if (storedId !== 'none') {
            this.setStudent(storedId);
        }
    }

    async setStudent(id) {
        console.log(`[Calendar] Setting student to ${id}`);

        if (window.sessionStorage) {
            const storedId = nullishCheck(window.sessionStorage.getItem('calendarStudentID'), 'none');

            // dont bother setting and refreshing everything
            // if we've selected the same student.
            if (storedId === id) {
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

        const { studentsList } = this.state;

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
                li(span(
                    '.fake-link',
                    {
                        onclick: () => {
                            this.setStudent(student.id);
                        },
                    },
                    studentName,
                )),
            );
        }

        let studentSet = p(await window.bcnI18n.getPhrase('cal_no_students_for_this_group'));
        if (studentLinks.length > 0) {
            studentSet = ul(studentLinks);
        }

        return div(
            '.full-width',
            h2(`${await window.bcnI18n.getPhrase('cal_inspect_student')}:`),
            studentSet,
        );
    }
}

class StudentGroupSelector extends Component {
    state = {
        groupId: 0,
    };

    async render() {
        const options = [];
        const vals = Object.values(await window.beaconingAPI.getGroups());
        const groups = nullishCheck(vals, []);

        options.push(
            option({
                disabled: true,
                selected: true,
                value: '',
            }, 'Select a group')
        );

        for (const group of groups) {
            options.push(
                option({
                    value: `${group.id}`,
                    students: group.students,
                    selected: this.state.groupId === group.id,
                }, `${group.name}`),
            );
        }

        const studentSel = new StudentSelector();

        const studentSelEl = await studentSel.attach();

        const selectGroupTranslation = await window.bcnI18n.getPhrase('cal_select_group');

        return div(
            '.group-select',
            h2(`${selectGroupTranslation}:`),
            label(
                '.select',
                select(
                    '#so-class-list',
                    {
                        onchange: (event) => {
                            const self = event.target;
                            const selectedOption = self.options[self.selectedIndex];
                            const groupId = selectedOption.value;
                            studentSel.refresh(groupId, selectedOption.students);
                        },
                    },
                    options,
                ),
            ),
            studentSelEl,
        );
    }
}

class SelectorPanel extends Component {
    async render() {
        const studentGroupSelector = new StudentGroupSelector();

        const studentGroupSelEl = await studentGroupSelector.attach();

        return section('.full-width', studentGroupSelEl);
    }
}

export default SelectorPanel;
