// @flow
import { div, p, a, h3, h4, strong } from '../../../core/html';

import { Component } from '../../../core/component';

class GLPBox extends Component {
    async render(data: { [string]: any }) {
        const {
            name,
            domain,
            topic,
            description,
            id,
        } = data;

        return div(
            '.box.flex-4.flex-column',
            div(
                '.toolbar',
                a('.item', 'View'),
                a('.item', 'Options'),
                a(
                    '.item',
                    {
                        href: `./authoring_tool?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&prev=lesson_manager`,
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
                div(
                    '.flex-column',
                    h4('.domain', domain),
                ),
            ),
            div(
                '.content.flex-column',
                p(
                    '.topic',
                    strong('Topic: '),
                    topic,
                ),
                p(
                    '.description',
                    strong('Description: '),
                    description,
                ),
            ),
        );
    }
}

export default GLPBox;
