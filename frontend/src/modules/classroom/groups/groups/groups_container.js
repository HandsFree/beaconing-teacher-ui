// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import LoadGroups from './load_groups';

class GroupsContainer extends Component {
    async render() {
        const loading = new Loading();
        const loadingEl = await loading.attach({
            msg: await window.beaconingAPI.getPhrase('ld_groups'),
        });

        return section('.flex-column', loadingEl);
    }

    async afterMount() {
        const loadGroups = new LoadGroups();

        const loadGroupsEl = await loadGroups.attach();

        const element = section('.flex-column', loadGroupsEl);

        this.updateView(element);
    }
}

export default GroupsContainer;
