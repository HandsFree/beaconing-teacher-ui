// @flow
import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import StudentBox from './student_box_edit';

class StudentsList extends Component {
    async init() {
        this.state.students = await window.beaconingAPI.getStudents() ?? [];
    }

    async render() {
        let { groupStudents } = this.props;
        const students = Object.values(this.state.students);
        const promArr = [];

        if (!Array.isArray(groupStudents)) {
            groupStudents = [];
        }

        for (const student of students) {
            const {
                id,
                username,
                profile,
            } = student;

            const studentBox = new StudentBox();

            const studentBoxProm = studentBox.attach({
                id,
                username,
                profile,
                checked: groupStudents.indexOf(id) !== -1,
            });

            promArr.push(studentBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => div('#student-list.flex-wrap.margin-10', elements));
    }
}

export default StudentsList;
