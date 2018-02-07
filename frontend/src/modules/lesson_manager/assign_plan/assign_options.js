// @flow
import { div, h4 } from '../../../core/html';

import { Component } from '../../../core/component';
import StudentBox from './student_box';

/* eslint-disable no-restricted-syntax */

class AssignOptions extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Assign Options] GLP ID not provided');
        }

        const students = await window.beaconingAPI.getStudents();
        this.state.students = students;
    }

    async render() {
        const studentsProm = [];

        for (const student of this.state.students) {
            const studentBox = new StudentBox();
            const studentBoxEl = studentBox.attach({
                student,
                id: this.props.id,
            });

            studentsProm.push(studentBoxEl);
        }

        return Promise.all(studentsProm).then((studentsEl) => {
            return div(
                '#assign-options',
                div('.title', h4('Students:')),
                div(
                    '.students-container',
                    studentsEl,
                ),
            );
        });
    }
}

export default AssignOptions;
