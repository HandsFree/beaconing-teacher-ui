// @flow
import { div, p, a, h3, strong } from '../../../../core/html';

import { Component } from '../../../../core/component';

class GLPBox extends Component {
    async render() {
        const {
            name,
            domain,
            topic,
            creationDate,
            updateDate,
            id,
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
                    '.topic',
                    strong('Created:'),
                    p(
                        {
                            title: timeCreatedText,
                        },
                        dateCreatedText,
                    ),
                ),
                div(
                    '.topic',
                    strong('Modified:'),
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
