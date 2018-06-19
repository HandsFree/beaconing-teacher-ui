// @flow
import { section, div, p } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import StudentBox from './student_box';
class GroupStudents extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return section(
            '.flex-column',
            loadingEl,
        );
    }

    async afterMount() {
        const { id } = this.props;
        const group = await window.beaconingAPI.getGroup(id);

        console.log(group);

        if (group) {
            const students = [];

            if (!group.students) {
                return;
            }

            for (const student of group.students) {
                const studentObj = await window.beaconingAPI.getStudent(student.id);

                students.push(studentObj);
            }

            const promArr = [];

            for (const studentObj of students) {
                if (studentObj.username) {
                    const studentBox = new StudentBox();

                    const studentBoxProm = studentBox.attach({
                        studentID: studentObj.id,
                        groupID: id,
                        username: studentObj.username,
                        firstName: studentObj.profile.firstName,
                        lastName: studentObj.profile.lastName,
                        identiconSha512: studentObj.identiconSha512,
                    });

                    promArr.push(studentBoxProm);
                }
            }

            Promise.all(promArr)
                .then((elements) => {
                    const el = div('#group-students-container.flex-wrap', elements);
                    this.updateView(el);
                });

            return;
        }

        const el = div(
            '#group-students-container.status',
            p(await window.bcnI18n.getPhrase('no_students_assigned')),
        );

        this.updateView(el);
    }
}

export default GroupStudents;
