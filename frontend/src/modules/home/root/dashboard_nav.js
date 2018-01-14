// @flow

import Component from '../../../core/component';

class DashboardNav extends Component {
    async render(): Promise<string> {
        const renderData = {
            path: 'home/root/templates/dashboard_nav',
        };

        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default DashboardNav;
