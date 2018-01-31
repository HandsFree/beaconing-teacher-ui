// @flow
// import List from 'list.js';

import { div } from '../../../core/html';

import { Component } from '../../../core/component';
import ActivePlanBox from './active_plan_box';

/* eslint-disable no-restricted-syntax */

class LoadActivePlans extends Component {
    // list: List;

    async render() {
        // hm
        return div('.active_plans-container.list.flex-wrap');
    }

    async load() {
        // TODO move this to load_active_plans.js or something?
        this.state.activePlans = await window.beaconingAPI.getActivePlans();

        const values = Object.values(this.state.activePlans);
        console.log(values);

        const promArr = [];

        for (const activePlan of values) {
            console.log(activePlan);
            const {
                name,
                image,
                link,
            } = activePlan;

            const activePlanBox = new ActivePlanBox();
            const apBoxProm = activePlanBox.attach({
                name,
                image,
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
