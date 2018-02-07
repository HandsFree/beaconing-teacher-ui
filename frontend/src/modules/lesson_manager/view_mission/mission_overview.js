// @flow
import { section, div } from '../../../core/html';

import { Component } from '../../../core/component';
import Loading from '../../loading';
import LoadMission from './load_mission';

class MissionOverview extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return section(
            '.flex-column',
            div(loadingEl),
        );
    }

    async afterMount() {
        const loadMission = new LoadMission();

        // console.log(this.props);

        const loadMissionEl = await loadMission.attach(this.props);

        this.updateView(loadMissionEl);
    }
}

export default MissionOverview;
