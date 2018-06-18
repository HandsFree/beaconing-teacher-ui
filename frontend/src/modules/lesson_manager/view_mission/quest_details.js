// @flow
import { div, h4 } from '../../../core/html';

import { Component } from '../../../core/component';
import QuestDetail from './quest_detail';

class QuestDetails extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Quest Details] GLP ID not provided');
        }

        const sessionGLP = JSON.parse(window.sessionStorage.getItem(`glp_${this.props.id}`));
        this.state.glp = sessionGLP.glp;
        this.state.quests = this.state.glp.content.missions[this.props.index].quests;
    }

    async render() {
        const questsProm = [];
        
        if (this.state.quests) {
            for (const questObj of this.state.quests) {
                const quest = new QuestDetail();
                const questEl = quest.attach({
                    quest: questObj,
                });
    
                questsProm.push(questEl);
            }

            const questsText = await window.bcnI18n.getPhrase('lm_quests');
    
            return Promise.all(questsProm)
                .then(questsEl => div(
                    '#quests-details',
                    div('.title', h4(`${questsText}:`)),
                    div(
                        '.details-container',
                        questsEl,
                    ),
                ));
        }

        return div(
            '#quests-details',
            div('.title', h4(`${await window.bcnI18n.getPhrase('lm_quests')}:`)),
        );
    }
}

export default QuestDetails;
