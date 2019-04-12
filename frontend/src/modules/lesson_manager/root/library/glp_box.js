// @flow
import { div, p, a, h3, strong } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

const interfaceKeys = [
    'lm_not_rec', 'never', 'lm_owner', 'view', 'lm_assign', 'lm_created',
    'lm_domain', 'lm_mod', 'lm_topic',
];

// TODO
// in theory it would be better to do the getPhrase once
// then pass it to this GLPBox, but that's a bit messy
// passing UI text data to a component
//
// however, it would probably be a bit quicker than
// performong a getPhrase request for every GLPBox.
class GLPBox extends Component {
    async init() {
        this.state = {
            trans: await window.beaconingAPI.getPhrases(...interfaceKeys),
        };
    }

    async render() {
        const {
            name,
            domain,
            topic,
            creationDate,
            updateDate,
            id,
            owner,
            readOnly,
        } = this.props;
        console.log(this.props);

        let dateCreatedText = this.state.trans.get('lm_not_rec');
        let timeCreatedText = '';
        let dateUpdatedText = this.state.trans.get('never');
        let timeUpdatedText = '';

        if (creationDate && creationDate !== '0001-01-01T00:00:00Z') {
            const dateObj = new Date(creationDate);
            dateCreatedText = dateObj.toDateString();
            timeCreatedText = dateObj.toTimeString();
        }

        if (updateDate && updateDate !== '0001-01-01T00:00:00Z') {
            const dateObj = new Date(updateDate);
            dateUpdatedText = dateObj.toDateString();
            timeUpdatedText = dateObj.toTimeString();
        }

        // edit button for this glp.
        const editItem = a(
            '.item',
            {
                href: `#edit?id=${encodeURIComponent(id)}`,
            },
            this.state.trans.get('edit'),
        );

        return div(
            '.glp-box.flex-4.flex-column',
            div(
                '.title',
                div(
                    '.flex-column',
                    h3('.name', name),

                    div(
                        p(
                            '.owner',
                            `${this.state.trans.get('lm_owner')} ${owner}`,
                        ),
                    ),                    
                    div(
                        '.toolbar.margin-top-10',
                        a(
                            '.item',
                            {
                                href: `#view?id=${encodeURIComponent(id)}`,
                            },
                            this.state.trans.get('view'),
                        ),
                        readOnly ? [] : editItem,
                        a(
                            '.item',
                            {
                                href: `#assign?id=${encodeURIComponent(id)}`,
                            },
                            this.state.trans.get('lm_assign'),
                        ),
                    ),
                ),
            ),
            div(
                '.content.flex-column',
                div(
                    '.created',
                    strong(`${this.state.trans.get('lm_created')}:`),
                    p(
                        {
                            title: timeCreatedText,
                        },
                        dateCreatedText,
                    ),
                ),
                div(
                    '.domain',
                    strong(`${this.state.trans.get('lm_domain')}:`),
                    p(domain),
                ),
                div(
                    '.topic',
                    strong(this.state.trans.get('lm_topic')),
                    p(topic),
                ),
                div(
                    '.modified',
                    strong(`${this.state.trans.get('lm_mod')}:`),
                    p(
                        {
                            title: timeUpdatedText,
                        },
                        dateUpdatedText,
                    ),
                ),
            ),
        );
    }
}

export default GLPBox;
