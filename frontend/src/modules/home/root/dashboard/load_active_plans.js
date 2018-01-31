// @flow
// import List from 'list.js';

import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import ActivePlanBox from './active_plan_box';

/* eslint-disable no-restricted-syntax */

class LoadActivePlans extends Component {
    async render() {
        return div('.active-plans-container.flex-column');
    }

    async load() {
        this.state.activePlans = await window.beaconingAPI.getActivePlans();

        const values = Object.values(this.state.activePlans);

        const promArr = [];

        for (const activePlan of values) {
            const {
                name,
                src,
                link,
            } = activePlan;

            const activePlanBox = new ActivePlanBox();
            const apBoxProm = activePlanBox.attach({
                name,
                src,
                link,
            });
            promArr.push(apBoxProm);
        }

        Promise.all(promArr).then((elements) => {
            for (const el of elements) {
                this.appendView(el);
            }
        });
    }

    async afterMount() {
        await this.load();
    }
}

export default LoadActivePlans;
