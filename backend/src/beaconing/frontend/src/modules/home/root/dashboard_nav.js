// @flow

import Component from '../../../core/component';

class DashboardNav extends Component {
    async render(): Promise<string> {
        return this.preparePage('home/root/templates/dashboard_nav', {});
    }
}

export default DashboardNav;
