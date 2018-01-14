// @flow

import Component from '../../../core/component';

class RecentActivities extends Component {
    async render(): Promise<string> {
        const renderData = {
            path: 'home/root/templates/recent_activities',
        };

        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default RecentActivities;
