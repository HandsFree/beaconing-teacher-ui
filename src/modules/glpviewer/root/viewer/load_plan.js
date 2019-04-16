// @flow
import { pre } from '../../../../core/html';

import { Component } from '../../../../core/component';

class LoadPlan extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Load Plan] GLP ID not provided');
        }

        const glp = await window.beaconingAPI.getGLP(this.props.id);

        if (glp) {
            const content = glp.content ? JSON.parse(glp.content) : null;
            const externConfig = glp.externConfig ? JSON.parse(glp.externConfig) : null;

            this.state.glp = glp;
            this.state.glp.content = content;
            this.state.glp.externConfig = externConfig;
        }
    }

    async render() {
        return pre(JSON.stringify(this.state.glp, null, 2));
    }
}

export default LoadPlan;
