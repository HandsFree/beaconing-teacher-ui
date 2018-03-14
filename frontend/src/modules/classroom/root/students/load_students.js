// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import StudentBox from './student_box';

/* eslint-disable no-restricted-syntax */

class LoadStudents extends Component {
    async forceStudentLoad() {
        console.log('[API Core] Loading students from beaconing API!');

        let students = await window.beaconingAPI.getStudents();
        if (!Array.isArray(students)) {
            console.log('Failed to load students!');

            // set the students in the state to an
            // empty array to avoid error later on.
            students = [];
        }

        this.state.students = students;
        console.log(`Loaded students ${students}`);

        window.sessionStorage.setItem('students', JSON.stringify({
            students: this.state.students,
            time: Date.now(),
        }));
    }

    async init() {
        if (window.sessionStorage && window.sessionStorage.length > 0) {
            console.log('Loading students from session storage');
            let studentsSession = window.sessionStorage.getItem('students');

            if (studentsSession) {
                // console.log(sessionGLP);
                studentsSession = JSON.parse(studentsSession);

                if ((Date.now() / 60000) - (studentsSession.time / 60000) < 1) {
                    this.state.students = studentsSession.students;
                }
            }
        } else {
            this.forceStudentLoad();
        }
    }

    async render() {
        if (!Array.isArray(this.state.students) || this.state.students.length === 0) {
            this.forceStudentLoad();
        }

        const students = Object.values(this.state.students);
        const promArr = [];

        for (const student of students) {
            const {
                id,
                username,
            } = student;

            const studentBox = new StudentBox();

            const studentBoxProm = studentBox.attach({
                id,
                username,
            });

            promArr.push(studentBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => section('.flex-container.flex-wrap.margin-20.list', elements));
    }
}

export default LoadStudents;
