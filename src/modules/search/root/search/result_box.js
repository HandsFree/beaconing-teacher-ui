// @flow
import { div, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class ResultBox extends Component {
    async render() {
        const {
            title,
            link,
        } = this.props;

        const card = div(
            '.result',
            div(
                '.title',
                title,
            ),
        );
        return a(
            {
                href: link,
            },
            card,
        );
    }
}

export default ResultBox;
