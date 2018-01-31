// @flow
import { div, img, p, a, h3, h4, strong } from '../../../core/html';

import { Component } from '../../../core/component';

class ActivePlanBox extends Component {
    async render(data: { [string]: any }) {
        const {
            name,
            image,
            link,
        } = data;

        return div(
            '.plan',
            div(
                '.image',
                img({
                    src: `${image}`,
                    alt: `${name}`,
                }),
            ),
            div(
                '.info',
                div(
                    '.name',
                    p(`${name}`),
                ),
            ),
        );
    }
}

export default ActivePlanBox;
