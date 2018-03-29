// @flow
import { section } from '../../../core/html';

import { Component } from '../../../core/component';
import AssignHeader from './assign_header';
import AssignOptions from './assign_options';

class LoadAssignPlan extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Assign Plan Overview] GLP ID not provided');
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
        const assignHeader = new AssignHeader();
        const assignOptions = new AssignOptions();

        const assignHeaderEl = await assignHeader.attach(this.props);
        const assignOptionsEl = await assignOptions.attach(this.props);

        return [
            section(
                '.flex-column',
                assignHeaderEl,
            ),
            section(
                '.flex-column',
                assignOptionsEl,
            ),
        ];
    }
}

export default LoadAssignPlan;
