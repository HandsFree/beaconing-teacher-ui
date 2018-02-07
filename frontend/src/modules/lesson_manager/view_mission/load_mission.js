// @flow
import { section } from '../../../core/html';

import { Component } from '../../../core/component';
import MissionHeader from './mission_header';
import MissionDetails from './mission_details';
import QuestDetails from './quest_details';

class LoadMission extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Mission Overview] GLP ID not provided');
        }

        if (window.sessionStorage) {
            let sessionGLP = window.sessionStorage.getItem(`glp_${this.props.id}`);

            if (sessionGLP) {
                sessionGLP = JSON.parse(sessionGLP);

                if ((Date.now() / 60000) - (sessionGLP.time / 60000) < 1) {
                    this.state.glp = sessionGLP.glp;
                    return;
                }
            }

            const { content } = await window.beaconingAPI.getGLP(this.props.id);

            this.state.glp = JSON.parse(content);
            window.sessionStorage.setItem(`glp_${this.props.id}`, JSON.stringify({
                glp: this.state.glp,
                time: Date.now(),
            }));
        }
    }

    async render() {
        const missionHeader = new MissionHeader();
        const missionDetails = new MissionDetails();
        const questDetails = new QuestDetails();

        const missionHeaderEl = await missionHeader.attach(this.props);
        const missionDetailsEl = await missionDetails.attach(this.props);
        const questDetailsEl = await questDetails.attach(this.props);

        return [
            section(
                '.flex-column',
                missionHeaderEl,
            ),
            section(
                '.flex-column',
                missionDetailsEl,
            ),
            section(
                '.flex-column',
                questDetailsEl,
            ),
        ];
    }
}

export default LoadMission;
