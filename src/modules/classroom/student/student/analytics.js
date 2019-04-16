// @flow
import { h2, div, p, section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import Charts from './charts';

class Analytics extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return section(
            '.flex-column',
            loadingEl,
        );
    }

    async afterMount() {
        const charts = new Charts();

        const chartsEl = await charts.attach(this.props);

        const el = section(
            '#student-analytics.flex-grow',
            chartsEl,
        );
        this.updateView(el);
    }
}

export default Analytics;
