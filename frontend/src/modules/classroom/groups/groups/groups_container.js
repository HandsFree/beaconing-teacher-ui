// @flow
import List from 'list.js';

import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import LoadGroups from './load_groups';

const listConfig = {
    valueNames: ['name'],
    indexAsync: true,
};

class GroupsContainer extends Component {
    list: List;

    async render() {
        const loading = new Loading();
        const loadingEl = await loading.attach();

        return section('.flex-column', loadingEl);
    }

    async afterMount() {
        const loadGroups = new LoadGroups();

        const loadGroupsEl = await loadGroups.attach();

        const element = section('.flex-column', loadGroupsEl);

        this.updateView(element);
    }

    async afterViewUpdate() {
        this.list = new List('groups', listConfig);
    }
}

export default GroupsContainer;
