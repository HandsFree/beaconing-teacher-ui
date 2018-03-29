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
        return div(
            '#mission-details',
            div('.title', h4('Mission Details:')),
            div(
                '.large-details',
                div(
                    '.detail',
                    strong('Description:'),
                    p(this.state.mission.description),
                ),
                div(
                    '.detail',
                    strong('Skills:'),
                    p(this.state.mission.skills),
                ),
            ),
        );
    }
}

export default MissionDetails;
