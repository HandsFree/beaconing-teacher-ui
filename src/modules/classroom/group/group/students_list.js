// @flow
import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import StudentBox from './student_box_edit';
import nullishCheck from '../../../../core/util';

class StudentsList extends Component {
    async init() {
        this.state.students = nullishCheck(await window.beaconingAPI.getStudents(), []);
    }

    async render() {
        let { groupStudents } = this.props;
        const students = Object.values(this.state.students);
        const promArr = [];

        if (!Array.isArray(groupStudents)) {
            groupStudents = [];
        }

        const usernameTrans = await window.beaconingAPI.getPhrase('username');

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
                usernameTrans,
            });

            promArr.push(studentBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => div('#student-list.flex-wrap.margin-10', elements));
    }
}

export default StudentsList;
