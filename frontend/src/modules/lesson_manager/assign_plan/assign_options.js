// @flow
import { div, h4 } from '../../../core/html';

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

        for (const student of this.state.students) {
            const studentBox = new StudentBox();
            const studentBoxEl = studentBox.attach({
                student,
                glpID: this.props.id,
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
            div(
                '.flex-column',
                div('.title', h4('Students:')),
                div(
                    '.students-container',
                    studentsEl,
                ),
            ),
            div(
                '.flex-column',
                div('.title', h4('Groups:')),
                div(
                    '.groups-container',
                    groupsEl,
                ),
            ),
        );
    }
}

export default AssignOptions;
