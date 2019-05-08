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
            readOnly,

            currentUser,
            translationSet,
        } = this.props;

        let dateCreatedText = translationSet.get('lm_not_rec');
        let timeCreatedText = '';
        let dateUpdatedText = translationSet.get('never');
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
            translationSet.get('edit'),
        );

        const ownedByMe = owner == currentUser;

        const glpBox = div(
            '.glp-box.flex-4.flex-column',
            div(
                '.title',
                div(
                    '.flex-column.full-width',
                    h3('.name', name),

                    div(
                        p(
                            '.owner',
                            `${translationSet.get('lm_owner')} ${owner}`,
                        ),
                    ),        
                    div(
                        '.toolbar.margin-top-20',
                        a(
                            '.item',
                            {
                                href: `#view?id=${encodeURIComponent(id)}`,
                            },
                            translationSet.get('view'),
                        ),
                        // what about readOnly?
                        ownedByMe ? editItem : [],
                        a(
                            '.item',
                            {
                                href: `#assign?id=${encodeURIComponent(id)}`,
                            },
                            translationSet.get('lm_assign'),
                        ),
                    ),
                ),
            ),
            div(
                '.content.flex-column',
                div(
                    '.created',
                    strong(`${translationSet.get('lm_created')}:`),
                    p(
                        {
                            title: timeCreatedText,
                        },
                        dateCreatedText,
                    ),
                ),
                div(
                    '.domain',
                    strong(`${translationSet.get('lm_domain')}:`),
                    p(domain),
                ),
                div(
                    '.topic',
                    strong(translationSet.get('lm_topic')),
                    p(topic),
                ),
                div(
                    '.modified',
                    strong(`${translationSet.get('lm_mod')}:`),
                    p(
                        {
                            title: timeUpdatedText,
                        },
                        dateUpdatedText,
                    ),
                ),
            ),
        );
        if (ownedByMe) {
            glpBox.classList.add('owned');
        }
        return glpBox;
    }
}

export default GLPBox;
