// @flow
import { div, p, a, h3, h4, strong } from '../../../../core/html';

import { Component } from '../../../../core/component';

class GLPBox extends Component {
    async render() {
        const {
            name,
            domain,
            topic,
            description,
            id,
        } = this.props;

        return div(
            '.glp-box.flex-4.flex-column',
            div(
                '.toolbar',
                a(
                    '.item',
                    {
                        href: `#view?id=${id}&prev=lesson_manager/new_plan`,
                    },
                    'View',
                ),
                a(
                    '.item',
                    {
                        href: `//${window.location.host}/authoring_tool?id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&prev=lesson_manager`,
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
                    '.description',
                    strong('Description:'),
                    p(description),
                ),
            ),
        );
    }
}

export default GLPBox;
