// @flow
import {
    div,
    h2,
    a,
    section,
} from '../../../../core/html';

import { Component } from '../../../../core/component';
import GroupBox from './group_box';
import nullishCheck from '../../../../core/util';

class LoadGroups extends Component {
    updateHooks = {
        SearchDone: this.handleSearch,
    };

    async handleSearch(event: CustomEvent) {
        const { detail } = event;

        const { MatchedGroups } = detail;

        if (Array.isArray(MatchedGroups) && MatchedGroups.length >= 1) {
            this.emit('SearchResultsGiven');
            this.state.groups = MatchedGroups;
            await this.render() |> this.updateView;

            return;
        }

        this.emit('SearchNoResults');
    }

    async init() {
        this.state.groups = nullishCheck(await window.beaconingAPI.getGroups(), []);
    }

    async render() {
        const groups = Object.values(this.state.groups);
        const promArr = [];

        const createGroupCard = a(
            {
                href: '#create',
            },
            div(
                '.small-box.create-group-box',
                h2('+'),
            ),
        );
        promArr.push(createGroupCard);

        // TODO this is a dupe of another GroupBox?
        for (const group of groups) {
            const {
                id,
                name,
                students,
            } = group;

            const groupBox = new GroupBox();

            const groupBoxProm = groupBox.attach({
                id,
                name,
                studentCount: students.length,
            });

            promArr.push(groupBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => section('.group-list-container.list', elements));
    }
}

export default LoadGroups;
