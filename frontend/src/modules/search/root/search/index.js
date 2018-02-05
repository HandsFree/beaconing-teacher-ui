// @flow
import { div, main, section } from '../../../../core/html';

import { RootComponent } from '../../../../core/component';
import Header from '../../../header/root';
import MainNav from '../../../nav/main';
import QuerySearch from '../../query';
import SearchResults from './search_results';

class Search extends RootComponent {
    async render() {
        const header = new Header();
        const mainNav = new MainNav();
        const search = new QuerySearch();
        const searchResults = new SearchResults();

        return Promise.all([
            header.attach(),
            mainNav.attach(),
            search.attach({
                searchType: 'width-expand',
            }),
            searchResults.attach(this.params),
        ]).then((values) => {
            const [
                headerEl,
                mainNavEl,
                searchEl,
                searchResultsEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand.margin-top-2',
                    mainNavEl,
                    main(
                        '#search-results',
                        section('.flex-column', searchEl),
                        section(
                            '.flex-spacebetween',
                            searchResultsEl,
                        ),
                    ),
                ),
            );
        });
    }
}

export default Search;
