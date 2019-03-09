// @flow
import { div, i, input, span } from '../../../core/html';

import { Component } from '../../../core/component';
import nullishCheck from '../../../core/util';
import { last } from 'fp-ts/lib/Array';

type QueryObject = {
    query: string,
    filter: string,
    sort: {
        type: string,
        order: string,
    },
};

class APISearchStatic extends Component {
    queryObj: QueryObject = {
        query: '',
        filter: '',
        sort: {
            type: '',
            order: '',
        },
    };

    updateHooks = {
        SearchFilterUpdate: this.updateFilter,
        SearchResultsGiven: this.hideError,
        SearchNoResults: this.showError,
    };

    async init() {
        if (this.props?.filterOptions) {
            this.queryObj = {
                query: '',
                ...this.props.filterOptions,
            };
        }
    }

    hideError() {
        const errorEl = document.getElementById('search-no-results');

        if (!nullishCheck(errorEl, false)) {
            return;
        }

        if (errorEl.classList.contains('show')) {
            errorEl.classList.remove('show');
        }
    }

    showError() {
        const errorEl = document.getElementById('search-no-results');

        if (!nullishCheck(errorEl, false)) {
            return;
        }

        if (!errorEl.classList.contains('show')) {
            errorEl.classList.add('show');
        }
    }

    updateFilter(event: CustomEvent) {
        const { detail } = event;

        if (nullishCheck(detail?.filter, false)) {
            const filter = (nullishCheck(detail, {}));
            
            this.queryObj = {
                query: '',
                ...filter,
            };
            
            this.hideError();

            if (nullishCheck(this.view)) {
                this.view.querySelector('input').value = '';
            }
        }
    }

    async doSearch() {
        // if (!this.queryObj || this.queryObj.query === '') {
        //     return;
        // }

        const results = await window.beaconingAPI.getSearchResults(this.queryObj);
        if (nullishCheck(results, false)) {
            this.emit('SearchDone', results);
        }
    }

    async render() {
        const {
            searchType,
        } = this.props;

        const noResultsStr = await window.beaconingAPI.getPhrase('lm_no_results');

        let typingTimer;

        // how many ms to wait till we do the
        // search POST
        const searchWaitInterval = 150;

        return div(
            '.search.flex-grow',
            i('.icon-search', { 'aria-hidden': true }),
            input(
                `.${searchType}`,
                {
                    type: 'text',
                    onkeyup: (event) => {
                        const { target } = event;
                        this.queryObj.query = target.value;
                        clearTimeout(typingTimer);

                        if (target.value) {
                            typingTimer = setTimeout(() => {
                                this.doSearch();
                            }, searchWaitInterval);
                        }
                    },
                    onkeypress: (event) => {
                        const {
                            key,
                        } = event;

                        if (key === 'Enter') {
                            this.doSearch();
                        }
                    },
                },
            ),
            span('#search-no-results.search-error', noResultsStr),
        );
    }
}

export default APISearchStatic;
