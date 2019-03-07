// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import StudentBox from './student_box';
import nullishCheck from '../../../../core/util';

class LoadStudents extends Component {
    updateHooks = {
        SearchDone: this.handleSearch,
    };

    async handleSearch(event: CustomEvent) {
        const { detail } = event;

        const { MatchedStudents } = detail;

        if (Array.isArray(MatchedStudents) && MatchedStudents.length >= 1) {
            this.emit('SearchResultsGiven');
            this.state.students = MatchedStudents;
            await this.render() |> this.updateView;

            return;
        }

        this.emit('SearchNoResults');
    }

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
            .then(elements => section('.student-list-container.list', elements));
    }
}

export default LoadStudents;
