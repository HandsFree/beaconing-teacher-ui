// @flow

import Component from '../../../core/component';

class RecentActivities extends Component {
    async render(): Promise<string> {
        return this.preparePage('home/root/templates/recent_activities', {});
    }
}

export default RecentActivities;
