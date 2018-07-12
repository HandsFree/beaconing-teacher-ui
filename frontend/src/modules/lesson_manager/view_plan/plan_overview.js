// @flow
import { section, div } from '../../../core/html';

import { Component } from '../../../core/component';
import Loading from '../../loading';
import LoadPlan from './load_plan';

class PlanOverview extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach({
            msg: await window.bcnI18n.getPhrase('ld_plan'),
        });

        return section(
            '.flex-column',
            div(loadingEl),
        );
    }

    async afterMount() {
        const loadPlan = new LoadPlan();

        // console.log(this.props);

        const loadPlanEl = await loadPlan.attach(this.props);

        this.updateView(loadPlanEl);
    }
}

export default PlanOverview;
