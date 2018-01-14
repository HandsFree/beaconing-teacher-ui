// @flow

import Component from '../../../core/component';

class ActivePlans extends Component {
    async render() {
        const renderData = {
            path: 'home/root/templates/active_plans',
        };

        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default ActivePlans;
