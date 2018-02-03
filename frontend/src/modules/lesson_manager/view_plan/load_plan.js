// @flow
import { section } from '../../../core/html';

import { Component } from '../../../core/component';
import PlanHeader from './plan_header';
import GLPDetails from './glp_details';

class LoadPlan extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Plan Overview] GLP ID not provided');
        }

        if (window.sessionStorage) {
            let sessionGLP = window.sessionStorage.getItem(`glp_${this.props.id}`);

            if (sessionGLP) {
                // console.log(sessionGLP);
                sessionGLP = JSON.parse(sessionGLP);

                if ((Date.now() / 60000) - (sessionGLP.time / 60000) < 1) {
                    this.state.glp = sessionGLP.glp;
                    return;
                }
            }

            const { content } = await window.beaconingAPI.getGLP(this.props.id);

            this.state.glp = JSON.parse(content);
            window.sessionStorage.setItem(`glp_${this.props.id}`, JSON.stringify({
                glp: this.state.glp,
                time: Date.now(),
            }));
        }
    }

    async render() {
        const planHeader = new PlanHeader();
        const glpDetails = new GLPDetails();

        const planHeaderEl = await planHeader.attach(this.props);
        const glpDetailsEl = await glpDetails.attach(this.props);

        return [
            section(
                '.flex-column',
                planHeaderEl,
            ),
            section(
                '.flex-column',
                glpDetailsEl,
            ),
        ];
    }
}

export default LoadPlan;
