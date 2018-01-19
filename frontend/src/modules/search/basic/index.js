// @flow
import { div, i, input } from '../../../core/html';

import { Component } from '../../../core/component';

class BasicSearch extends Component {
    async render(data: { [string]: any }): Promise<string> {
        const { searchType } = data;

        return div(
            '.search',
            i('.icon-search', { 'aria-hidden': true }),
            input(`.${searchType}`, { type: 'text' }),
        );
    }
}

export default BasicSearch;
