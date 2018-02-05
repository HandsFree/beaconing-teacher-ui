// @flow
import { div, span } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import GetResults from './get_results';

class SearchResults extends Component {
    async render() {
        const { query } = this.props;

        if (query) {
            const loading = new Loading();

            const loadingEl = await loading.attach();

            return div('.results.margin-20', loadingEl);
        }

        return div(
            '.results.margin-20',
            div(
                '.status',
                span('Type in the Search Box above, and press Enter'),
            ),
        );
    }

    async afterMount() {
        const { query } = this.props;

        if (query) {
            const getResults = new GetResults();

            const getResultsEl = await getResults.attach(this.props);

            const element = div('.results.margin-20.flex-column', getResultsEl);

            this.updateView(element);
        }
    }
}

export default SearchResults;
