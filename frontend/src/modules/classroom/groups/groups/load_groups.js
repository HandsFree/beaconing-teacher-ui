// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import GroupBox from './group_box';

/* eslint-disable no-restricted-syntax */

class LoadStudents extends Component {
    async init() {
        if (window.sessionStorage) {
            let groupsSession = window.sessionStorage.getItem('groups');

            if (groupsSession) {
                // console.log(sessionGLP);
                groupsSession = JSON.parse(groupsSession);

                if ((Date.now() / 1000) - (groupsSession.time / 1000) < 10) {
                    this.state.groups = groupsSession.groups;
                    return;
                }
            }

            const groups = await window.beaconingAPI.getGroups();

            this.state.groups = groups;
            window.sessionStorage.setItem('groups', JSON.stringify({
                groups: this.state.groups,
                time: Date.now(),
            }));
        }
    }

    async render() {
        const groups = Object.values(this.state.groups);
        const promArr = [];

        for (const group of groups) {
            const { name } = group;

            const groupBox = new GroupBox();

            const groupBoxProm = groupBox.attach({ name });

            promArr.push(groupBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => section('.flex-container.flex-wrap.margin-20.list', elements));
    }
}

export default LoadStudents;
