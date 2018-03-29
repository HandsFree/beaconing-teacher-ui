// @flow
import { section } from '../../../core/html';

import { Component } from '../../../core/component';
import PlanHeader from './plan_header';
import GLPDetails from './glp_details';
import MissionDetails from './mission_details';

class LoadPlan extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Plan Overview] GLP ID not provided');
        }

        if (window.sessionStorage) {
            let sessionGLP = window.sessionStorage.getItem(`glp_${this.props.id}`);

            if (sessionGLP) {
                sessionGLP = JSON.parse(sessionGLP);

                if ((Date.now() / 60000) - (sessionGLP.time / 60000) < 1) {
                    this.state.glp = sessionGLP.glp;
                    return;
                }
            }

            const glp = await window.beaconingAPI.getGLP(this.props.id);

            if (glp) {
                this.state.glp = glp;
                this.state.glp.content = JSON.parse(glp.content);
                window.sessionStorage.setItem(`glp_${this.props.id}`, JSON.stringify({
                    glp: this.state.glp,
                    time: Date.now(),
                }));
            }
        }
    }

    async render() {
        const planHeader = new PlanHeader();
        const glpDetails = new GLPDetails();
        const missionDetails = new MissionDetails();

        const planHeaderEl = await planHeader.attach(this.props);
        const glpDetailsEl = await glpDetails.attach(this.props);
        const missionDetailsEl = await missionDetails.attach(this.props);

        return [
            section(
                '.flex-column',
                planHeaderEl,
            ),
            section(
                '.flex-column',
                glpDetailsEl,
            ),
            section(
                '.flex-column',
                missionDetailsEl,
            ),
        ];
    }
}

export default LoadPlan;
