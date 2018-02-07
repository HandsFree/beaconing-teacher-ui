// @flow
import List from 'list.js';

import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import LoadStudents from './load_students';

/* eslint-disable no-restricted-syntax */

const listConfig = {
    valueNames: ['name'],
    indexAsync: true,
};

class StudentsContainer extends Component {
    list: List;

    async render() {
        const loading = new Loading();
        const loadingEl = await loading.attach();

        return section('.flex-column', loadingEl);
    }

    async afterMount() {
        const loadStudents = new LoadStudents();

        const loadStudentsEl = await loadStudents.attach();

        const element = section('.flex-column', loadStudentsEl);

        this.updateView(element);
    }

    async afterViewUpdate() {
        this.list = new List('students', listConfig);
    }
}

export default StudentsContainer;
