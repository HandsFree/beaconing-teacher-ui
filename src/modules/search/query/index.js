// @flow
import { div, i, input } from '../../../core/html';

import { Component } from '../../../core/component';

class QuerySearch extends Component {
    async render() {
        const {
            searchType,
            query,
        } = this.props;

        const searchQuery = do {
            if (query) {
                decodeURIComponent(query);
            } else {
                '';
            }
        };

        return div(
            '.draggable.search.fuzzy-search',
            i('.icon-search', { 'aria-hidden': true }),
            input(
                `.${searchType}`,
                {
                    type: 'text',
                    onkeypress: (event) => {
                        const {
                            key,
                            target,
                        } = event;

                        if (key === 'Enter') {
                            window.location.href = `//${window.location.host}/search?query=${encodeURIComponent(target.value)}`;
                        }
                    },
                    value: searchQuery,
                },
            ),
        );
    }
}

export default QuerySearch;
