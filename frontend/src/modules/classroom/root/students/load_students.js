// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import StudentBox from './student_box';

class LoadStudents extends Component {

    async init() {
        if (window.sessionStorage) {
            let studentsSession = window.sessionStorage.getItem('students');

            if (studentsSession) {
                // console.log(sessionGLP);
                studentsSession = JSON.parse(studentsSession);

                if ((Date.now() / 60000) - (studentsSession.time / 60000) < 1) {
                    this.state.students = studentsSession.students;
                    return;
                }
            }
        }

        if (!this.state.students) {
            const students = await window.beaconingAPI.getStudents();
            // console.log(JSON.parse(students));
            if (!students) {
                console.log('Failed to load students!');

                // set the students in the state to an
                // empty array to avoid error later on.
                this.state.students = [];
                return;
            }

            this.state.students = students;
            // console.log("Loaded students " + students);

            window.sessionStorage.setItem('students', JSON.stringify({
                students: this.state.students,
                time: Date.now(),
            }));
        }
    }

    async render() {
        const students = Object.values(this.state.students);
        const promArr = [];

        for (const student of students) {
            const {
                id,
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
