// @flow
import { div, p, a, h3, strong } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

class GLPBox extends Component {
    async deleteGLP() {
        const status = await window.beaconingAPI.deleteGLP(this.props.id);
        const statusMessage = new Status();

        console.log('[Delete GLP] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: await window.bcnI18n.getPhrase('glp_del'),
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('glp_nd'),
        });

        document.body.appendChild(statusMessageEl);
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
        } = this.props;

        let dateCreatedText = await window.bcnI18n.getPhrase('lm_not_rec');
        let timeCreatedText = '';
        let dateUpdatedText = await window.bcnI18n.getPhrase('lm_never');
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
                '.toolbar',
                a(
                    '.item',
                    {
                        href: `#view?id=${id}&prev=lesson_manager`,
                    },
                    await window.bcnI18n.getPhrase('view'),
                ),
                a(
                    '.item',
                    {
                        href: `//${window.location.host}/authoring_tool?id=${encodeURIComponent(id)}`,
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
                a(
                    '.item',
                    {
                        onclick: async () => {
                            const confirmDelGLPTranslation = await window.bcnI18n.getPhrase('confirm_delete_glp');

                            // https://eslint.org/docs/rules/no-alert
                            // breaking the rules for now!
                            const doDelete = confirm(confirmDelGLPTranslation);
                            if (doDelete) {
                                this.deleteGLP();
                            }
                        },
                    },
                    await window.bcnI18n.getPhrase('delete'),
                ),
            ),
            div(
                '.title',
                div(
                    '.flex-column',
                    h3('.name', name),
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
