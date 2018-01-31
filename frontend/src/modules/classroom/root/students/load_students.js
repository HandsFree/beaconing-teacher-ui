// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import StudentBox from './student_box';
import Loading from '../../../loading';

/* eslint-disable no-restricted-syntax */

class LoadStudents extends Component {
    async render() {
        const loading = new Loading();
        const loadingEl = await loading.attach();

        return section('.flex-container.flex-wrap.margin-20.list', loadingEl);
    }

    async load() {
        this.state.students = await window.beaconingAPI.getStudents();

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

        Promise.all(promArr).then((elements) => {
            for (const el of elements) {
                this.appendView(el);
            }
        });
    }

    async afterMount() {
        await this.load();

        // temporary solution
        const loading = this.view.getElementsByClassName('loading-container')[0];

        this.view.removeChild(loading);
    }
}

export default LoadStudents;
