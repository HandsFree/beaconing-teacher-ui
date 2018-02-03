// @flow
// import List from 'list.js';

import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import ActivePlanBox from './active_plan_box';

/* eslint-disable no-restricted-syntax */

class LoadActivePlans extends Component {
    async init() {
        if (window.sessionStorage) {
            let sessionActivePlans = window.sessionStorage.getItem('active_plans');

            if (sessionActivePlans) {
                sessionActivePlans = JSON.parse(sessionActivePlans);

                if ((Date.now() / 1000) - (sessionActivePlans.time / 1000) < 20) {
                    this.state.activePlans = sessionActivePlans.plans;
                    return;
                }
            }

            const plans = await window.beaconingAPI.getActivePlans();

            this.state.activePlans = plans;
            window.sessionStorage.setItem('active_plans', JSON.stringify({
                plans: this.state.activePlans,
                time: Date.now(),
            }));
        }
    }

    async render() {
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

        return Promise.all(promArr)
            .then(elements => div('.active-plans-container.flex-column', elements));
    }
}

export default LoadActivePlans;
