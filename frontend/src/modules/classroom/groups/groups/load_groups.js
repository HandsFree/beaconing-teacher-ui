// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import GroupBox from './group_box';

class LoadGroups extends Component {
    async init() {
        this.state.groups = await window.beaconingAPI.getGroups() ?? [];
    }

    async render() {
        const groups = Object.values(this.state.groups);
        const promArr = [];

        for (const group of groups) {
            const { 
                id,
                name,
            } = group;

            const groupBox = new GroupBox();

            const groupBoxProm = groupBox.attach({
                id,
                name,
            });

            promArr.push(groupBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => section('.flex-container.flex-wrap.margin-20.list', elements));
    }
}

export default LoadGroups;
