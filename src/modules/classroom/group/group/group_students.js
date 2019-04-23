// @flow
import { section, div, p } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import StudentBox from './student_box';
import StudentOverview from './student_overview';

class GroupStudents extends Component {
    async init() {
        this.state.trans = await window.beaconingAPI.getPhrases(
            'ld_students',
            'username',
            'no_students_assigned',
        );
    }

    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach({
            msg: this.state.trans.get('ld_students'),
        });

        return section(
            '.flex-column',
            loadingEl,
        );
    }

    async afterMount() {
        const { id } = this.props;
        const students = await window.beaconingAPI.getStudentsFromGroup(id);

        if (students && students.length != 0) {
            const promArr = [];

            const usernameTrans = this.state.trans.get('username');
            for (const studentObj of students) {
                console.log(studentObj);

                if (studentObj.username) {
                    const studentBox = new StudentBox();

                    const studentBoxProm = studentBox.attach({
                        studentID: studentObj.id,
                        groupID: id,
                        username: studentObj.username,
                        firstName: studentObj.profile.firstName,
                        lastName: studentObj.profile.lastName,
                        identiconSha512: studentObj.identiconSha512,
                        usernameTrans,
                    });

                    promArr.push(studentBoxProm);
                }
            }

            Promise.all(promArr)
                .then((elements) => {
                    const el = div(
                        '#group-students-container.flex-wrap.margin-20',
                        elements,
                    );
                    this.updateView(el);
                });

            return;
        }

        const el = div(
            '#group-students-container.status',
            p(this.state.trans.get('no_students_assigned')),
        );

        this.updateView(el);
    }
}

export default GroupStudents;
