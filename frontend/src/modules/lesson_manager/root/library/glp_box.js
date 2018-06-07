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
                message: 'GLP deleted!',
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: 'GLP not deleted!',
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

        let dateCreatedText = 'Not recorded';
        let timeCreatedText = '';
        let dateUpdatedText = 'Never';
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
                    'View',
                ),
                a(
                    '.item',
                    {
                        href: `//${window.location.host}/authoring_tool?id=${encodeURIComponent(id)}`,
                    },
                    'Edit',
                ),
                a(
                    '.item',
                    {
                        href: `#assign?id=${encodeURIComponent(id)}`,
                    },
                    'Assign',
                ),
                a(
                    '.item',
                    {
                        ondblclick: () => this.deleteGLP(),
                    },
                    'Delete',
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
                    strong('Domain:'),
                    p(domain),
                ),
                div(
                    '.topic',
                    strong('Topic:'),
                    p(topic),
                ),
                div(
                    '.created',
                    strong('Created:'),
                    p(
                        {
                            title: timeCreatedText,
                        },
                        dateCreatedText,
                    ),
                ),
                div(
                    '.modified',
                    strong('Modified:'),
                    p(
                        {
                            title: timeUpdatedText,
                        },
                        dateUpdatedText,
                    ),
                ),
                div(
                    '.owner',
                    strong('Owner:'),
                    p(owner),
                ),
            ),
        );
    }
}

export default GLPBox;
