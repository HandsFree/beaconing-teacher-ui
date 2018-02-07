// @flow
import { div, img, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class ActivePlanBox extends Component {
    async render() {
        const {
            name,
            src,
            link,
        } = this.props;

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
