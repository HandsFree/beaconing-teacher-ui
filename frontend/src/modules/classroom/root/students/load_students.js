// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import StudentBox from './student_box';

class LoadStudents extends Component {

    async init() {
        this.state.students = await window.beaconingAPI.getStudents() ?? [];
    }

    async render() {
        const students = Object.values(this.state.students);
        const promArr = [];

        for (const student of students) {
            const {
                id,
                username,
                profile,
                identiconSha512,
            } = student;

            const {
                firstName,
                lastName,
            } = profile;

            const studentBox = new StudentBox();

            const studentBoxProm = studentBox.attach({
                id,
                username,
                firstName,
                lastName,
                identiconSha512,
            });

            promArr.push(studentBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => section('.flex-container.flex-wrap.margin-20.list', elements));
    }
}

export default LoadStudents;
