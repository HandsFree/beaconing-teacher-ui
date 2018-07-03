// @flow
import { p, div, img, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class ActivePlanBox extends Component {
    async render() {
        const {
            name,
            description,
            link,
        } = this.props;

        return div(
            '.plan',
            div(
                '.info',
                p(
                    '.name',
                    a(
                        {
                            href: link,
                        },
                        name,
                    ),
                ),
            ),
            div(
                '.desc',
                p(
                    `${description}`,
                ),
            )
        );
    }
}

export default ActivePlanBox;
