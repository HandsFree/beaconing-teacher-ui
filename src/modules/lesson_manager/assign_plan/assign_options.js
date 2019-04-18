// @flow
import { div, nav, h4, a } from '../../../core/html';

import { Component } from '../../../core/component';
import StudentBox from './student_box';
import GroupBox from './group_box';

class AssignOptions extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Assign Options] GLP ID not provided');
        }

        const students = await window.beaconingAPI.getStudents();
        this.state.students = students;

        const groups = await window.beaconingAPI.getGroups();
        this.state.groups = groups;
    }

    async render() {
        const studentsProm = [];
        const groupsProm = [];

        const usernameTrans = await window.beaconingAPI.getPhrase('username');

        for (const student of this.state.students) {
            const studentBox = new StudentBox();
            const studentBoxEl = studentBox.attach({
                student,
                glpID: this.props.id,
                usernameTrans,
            });

            studentsProm.push(studentBoxEl);
        }

        for (const group of this.state.groups) {
            const groupBox = new GroupBox();
            const groupBoxEl = groupBox.attach({
                group,
                glpID: this.props.id,
            });

            groupsProm.push(groupBoxEl);
        }

        const studentsEl = await Promise.all(studentsProm).then(elements => elements);
        const groupsEl = await Promise.all(groupsProm).then(elements => elements);

        return div(
            '#assign-options',
            nav('#assign-tabs',
                div(
                    '.tab-container',
                    {
                        onmouseover: () => {
                            if (!this.tooltipsActive) {
                                tippy('.disabled-tab', {
                                    content: 'Disabled',
                                    arrow: true,
                                });

                                this.tooltipsActive = true;
                            }
                        },
                    },
                    a('.tab.active', `${await window.beaconingAPI.getPhrase('cr_students')}`),
                    a('.tab', `${await window.beaconingAPI.getPhrase('cr_groups')}`),
                ),
            ),

            // todo!
            div(
                '.flex-column.margin-top-20',
                div(
                    '.students-container',
                    studentsEl,
                ),
            ),
            div(
                '.flex-column',
                div(
                    '.groups-container',
                    groupsEl,
                ),
            ),
        );
    }
}

export default AssignOptions;
