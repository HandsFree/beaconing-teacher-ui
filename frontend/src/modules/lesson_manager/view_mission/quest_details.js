// @flow
import { div, h4 } from '../../../core/html';

import { Component } from '../../../core/component';
import QuestDetail from './quest_detail';

/* eslint-disable no-restricted-syntax */

class QuestDetails extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Quest Details] GLP ID not provided');
        }

        const sessionGLP = JSON.parse(window.sessionStorage.getItem(`glp_${this.props.id}`));
        this.state.glp = sessionGLP.glp;
        this.state.quests = this.state.glp.missions[this.props.index].quests;
    }

    async render() {
        const questsProm = [];

        for (const questObj of this.state.quests) {
            const quest = new QuestDetail();
            const questEl = quest.attach({
                quest: questObj,
            });

            questsProm.push(questEl);
        }

        return Promise.all(questsProm)
            .then(questsEl => div(
                '#quests-details',
                div('.title', h4('Quests:')),
                div(
                    '.details-container',
                    questsEl,
                ),
            ));
    }
}

export default QuestDetails;
