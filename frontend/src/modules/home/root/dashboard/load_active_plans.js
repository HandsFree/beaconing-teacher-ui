// @flow
// import List from 'list.js';

import { div, span } from '../../../../core/html';

import { Component } from '../../../../core/component';
import ActivePlanBox from './active_plan_box';

class LoadActivePlans extends Component {
    async init() {
        const plans = await window.beaconingAPI.getActivePlansWidget();

        this.state.activePlans = plans;
    }

    async render() {
        const values = Object.values(this.state.activePlans);

        if (values.length < 1) {
            // Add some style
            return div(
                '.active-plans-container.flex-column',
                div(
                    '.status',
                    span(await window.bcnI18n.getPhrase('widget_ap_no_plans')),
                ),
            );
        }

        const promArr = [];

        for (const activePlan of values) {
            const {
                name,
                description,
                link,
            } = activePlan;

            const activePlanBox = new ActivePlanBox();
            const apBoxProm = activePlanBox.attach({
                name,
                description,
                link,
            });
            promArr.push(apBoxProm);
        }

        return Promise.all(promArr)
            .then(elements => div('.active-plans-container.flex-column', elements));
    }
}

export default LoadActivePlans;
