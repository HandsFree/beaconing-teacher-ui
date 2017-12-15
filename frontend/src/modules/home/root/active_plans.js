// @flow

import Component from '../../../core/component';

class ActivePlans extends Component {
    async render(): Promise<string> {
        return this.preparePage('home/root/templates/active_plans', {});
    }
}

export default ActivePlans;
