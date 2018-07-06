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

        const glpDesc = do {
            if (description.length > 200) {
                p(`${description.substr(0, 200)}...`);
            } else {
                p(description);
            }
        };

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
                glpDesc,
            ),
        );
    }
}

export default ActivePlanBox;
