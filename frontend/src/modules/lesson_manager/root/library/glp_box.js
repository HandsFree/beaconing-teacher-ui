// @flow
import { div, p, a, h3, strong } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

class GLPBox extends Component {
    async render() {
        const {
            name,
            domain,
            topic,
            creationDate,
            updateDate,
            id,
            owner,
            currentUser,
        } = this.props;

        let dateCreatedText = await window.bcnI18n.getPhrase('lm_not_rec');
        let timeCreatedText = '';
        let dateUpdatedText = await window.bcnI18n.getPhrase('never');
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

        return div(
            '.glp-box.flex-4.flex-column',
            div(
                '.title',
                div(
                    '.flex-column',
                    h3('.name', name),
                    div(
                        '.toolbar',
                        a(
                            '.item',
                            {
                                href: `#view?id=${encodeURIComponent(id)}`,
                            },
                            await window.bcnI18n.getPhrase('view'),
                        ),
                        a(
                            '.item',
                            {
                                href: `#edit?id=${encodeURIComponent(id)}`,
                            },
                            await window.bcnI18n.getPhrase('edit'),
                        ),
                        a(
                            '.item',
                            {
                                href: `#assign?id=${encodeURIComponent(id)}`,
                            },
                            await window.bcnI18n.getPhrase('lm_assign'),
                        ),
                    ),
                ),
            ),
            div(
                '.content.flex-column',
                div(
                    '.domain',
                    strong(`${await window.bcnI18n.getPhrase('lm_domain')}:`),
                    p(domain),
                ),
                div(
                    '.topic',
                    strong(`${await window.bcnI18n.getPhrase('lm_topic')}:`),
                    p(topic),
                ),
                div(
                    '.created',
                    strong(`${await window.bcnI18n.getPhrase('lm_created')}:`),
                    p(
                        {
                            title: timeCreatedText,
                        },
                        dateCreatedText,
                    ),
                ),
                div(
                    '.modified',
                    strong(`${await window.bcnI18n.getPhrase('lm_mod')}:`),
                    p(
                        {
                            title: timeUpdatedText,
                        },
                        dateUpdatedText,
                    ),
                ),
                div(
                    '.owner',
                    strong(`${await window.bcnI18n.getPhrase('lm_owner')}:`),
                    p(owner),
                ),
            ),
        );
    }
}

export default GLPBox;
