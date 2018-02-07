// @flow
import List from 'list.js';

import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import LoadClasses from './load_classes';

/* eslint-disable no-restricted-syntax */

const listConfig = {
    valueNames: ['name'],
    indexAsync: true,
};

class ClassesContainer extends Component {
    list: List;

    async render() {
        const loading = new Loading();
        const loadingEl = await loading.attach();

        return section('.flex-column', loadingEl);
    }

    async afterMount() {
        const loadClasses = new LoadClasses();

        const loadClassesEl = await loadClasses.attach();

        const element = section('.flex-column', loadClassesEl);

        this.updateView(element);
    }

    async afterViewUpdate() {
        this.list = new List('classes', listConfig);
    }
}

export default ClassesContainer;
