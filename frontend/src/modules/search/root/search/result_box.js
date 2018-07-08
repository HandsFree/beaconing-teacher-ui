// @flow
import { div, h4, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class ResultBox extends Component {
    async render() {
        const {
            title,
            link,
        } = this.props;

        return div(
            '.result',
            div(
                '.title',
                title,
            ),
            a(
                {
                    href: link,
                },
                await window.bcnI18n.getPhrase('view'),
            ),
        );
    }
}

export default ResultBox;
