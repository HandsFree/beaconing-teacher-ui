// @flow
import { div, img, p, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class ActivePlanBox extends Component {
    async render(data: { [string]: any }) {
        const {
            name,
            src,
            link,
        } = data;

        return div(
            '.plan',
            div(
                '.image',
                img({
                    src,
                    alt: name,
                }),
            ),
            div(
                '.info',
                div(
                    '.name',
                    a(
                        {
                            href: link,
                        },
                        name,
                    ),
                ),
            ),
        );
    }
}

export default ActivePlanBox;
