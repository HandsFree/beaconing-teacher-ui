// @flow
import { div, h4 } from '../../../core/html';

import { Component } from '../../../core/component';
import MissionDetail from './mission_detail';

class MissionDetails extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Mission Details] GLP ID not provided');
        }

        const sessionGLP = JSON.parse(window.sessionStorage.getItem(`glp_${this.props.id}`));
        this.state.glp = sessionGLP.glp;
    }

    async render() {
        const missionsProm = [];

        if (this.state.glp.content?.missions) {
            for (const [index, missionObj] of this.state.glp.content.missions.entries()) {
                const mission = new MissionDetail();
                const missionEl = mission.attach({
                    mission: missionObj,
                    index,
                    ...this.props,
                });
    
                missionsProm.push(missionEl);
            }
    
            return Promise.all(missionsProm)
                .then(missionsEl => div(
                    '#missions-details',
                    div('.title', h4('Missions:')),
                    div(
                        '.details-container',
                        missionsEl,
                    ),
                ));
        }

        return div(
            '#missions-details',
            div('.title', h4('Missions:')),
        );
    }
}

export default MissionDetails;
