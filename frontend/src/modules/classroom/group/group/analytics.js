// @flow
import { section } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';

class Analytics extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return section(
            '.flex-column',
            loadingEl,
        );
    }
}

export default Analytics;
