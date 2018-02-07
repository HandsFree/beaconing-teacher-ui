// @flow
import List from 'list.js';

import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import LoadCourses from './load_courses';

/* eslint-disable no-restricted-syntax */

const listConfig = {
    valueNames: ['name'],
    indexAsync: true,
};

class CoursesContainer extends Component {
    list: List;

    async render() {
        const loading = new Loading();
        const loadingEl = await loading.attach();

        return section('.flex-column', loadingEl);
    }

    async afterMount() {
        const loadCourses = new LoadCourses();

        const loadCoursesEl = await loadCourses.attach();

        const element = section('.flex-column', loadCoursesEl);

        this.updateView(element);
    }

    async afterViewUpdate() {
        this.list = new List('courses', listConfig);
    }
}

export default CoursesContainer;
