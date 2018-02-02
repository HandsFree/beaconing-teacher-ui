// @flow
import { div, i, input } from '../../../core/html';

import { Component } from '../../../core/component';

class BasicSearch extends Component {
    async render() {
        const { searchType } = this.props;

        return div(
            '.search.fuzzy-search',
            i('.icon-search', { 'aria-hidden': true }),
            input(`.${searchType}`, { type: 'text' }),
        );
    }
}

export default BasicSearch;
