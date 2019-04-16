// @flow
import { section, div } from '../../../core/html';

import { Component } from '../../../core/component';
import Loading from '../../loading';
import LoadAssignPlan from './load_assign_plan';

class AssignOverview extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return section(
            '.flex-column',
            div(loadingEl),
        );
    }

    async afterMount() {
        const loadAssignPlan = new LoadAssignPlan();

        // console.log(this.props);

        const loadAssignPlanEl = await loadAssignPlan.attach(this.props);

        this.updateView(loadAssignPlanEl);
    }
}

export default AssignOverview;
