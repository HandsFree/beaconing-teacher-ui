// @flow
import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import StudentBox from './student_box';
import nullishCheck from '../../../../core/util';

class StudentsList extends Component {
    async init() {
        this.state.students = nullishCheck(await window.beaconingAPI.getStudents(), []);
    }

    async render() {
        const students = Object.values(this.state.students);
        const promArr = [];

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
            });

            promArr.push(studentBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => div('#student-list.flex-wrap.margin-10', elements));
    }
}

export default StudentsList;
