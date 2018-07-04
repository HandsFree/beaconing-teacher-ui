// @flow
import { div, i, input } from '../../../core/html';

import { Component } from '../../../core/component';
import nullishCheck from '../../../core/util';

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

    async init() {
        const {
            filterOptions,
        } = this.props;

        this.queryObj = {
            query: '',
            ...(nullishCheck(filterOptions, {})),
        };
    }

    async doSearch() {
        const results = window.beaconingAPI.getSearchResults(this.queryObj);
        console.log(results);
    }

    async render() {
        const {
            searchType,
        } = this.props;

        return div(
            '.search',
            i('.icon-search', { 'aria-hidden': true }),
            input(
                `.${searchType}`,
                {
                    type: 'text',
                    oninput: (event) => {
                        const { target } = event;

                        this.queryObj.query = target.value;
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
        );
    }
}

export default APISearchStatic;
