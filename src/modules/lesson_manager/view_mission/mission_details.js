// @flow
import { div, h4, strong, p } from '../../../core/html';

import { Component } from '../../../core/component';

class MissionDetails extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Mission Details] GLP ID not provided');
        }

        const sessionGLP = JSON.parse(window.sessionStorage.getItem(`glp_${this.props.id}`));
        this.state.glp = sessionGLP.glp;
        this.state.mission = this.state.glp.content.missions[this.props.index];
    }

    async render() {
        const { mission } = this.state;
        console.log('mission is', mission);

        return div(
            '#mission-details.flex-column',
            div('.title', h4(mission.name)),
            div(
                '.large-details.flex-column',
                div(
                    '.detail',
                    strong(`${await window.beaconingAPI.getPhrase('description')}:`),
                    p(mission.description),
                ),
                div(
                    '.detail',
                    strong(`${await window.beaconingAPI.getPhrase('lm_skills')}:`),
                    p(mission.skills),
                ),
            ),
        );
    }
}

export default MissionDetails;
