// @flow
import { div, span, option, select, label } from '../../../../core/html';

import { Component } from '../../../../core/component';

class Sort extends Component {
    state = {
        classID: null,
        sort: null,
    };

    async init() {
        const {
            id,
            sort,
        } = this.props;

        this.state.classID = id;
        this.state.sort = sort;
    }

    async render() {
        return div(
            '.sorting',
            div(
                '#student-overview-sort.sort-menu',
                label(
                    '.select',
                    span(`${await window.bcnI18n.getPhrase('sort_by')}: `),
                    select(
                        {
                            onchange: (event) => {
                                const { target } = event;

                                switch (target.value) {
                                case 'week':
                                    this.emit('StudentOverviewSortWeekClicked');
                                    break;
                                case 'month':
                                    this.emit('StudentOverviewSortMonthClicked');
                                    break;
                                case 'year':
                                    this.emit('StudentOverviewSortYearClicked');
                                    break;
                                default:
                                    this.emit('StudentOverviewSortWeekClicked');
                                    break;
                                }
                            },
                        },
                        option(
                            {
                                selected: this.state.sort === 'week',
                                value: 'week',
                            },
                            await window.bcnI18n.getPhrase('week'),
                        ),
                        option(
                            {
                                selected: this.state.sort === 'month',
                                value: 'month',
                            },
                            await window.bcnI18n.getPhrase('month'),
                        ),
                        option(
                            {
                                selected: this.state.sort === 'year',
                                value: 'year',
                            },
                            await window.bcnI18n.getPhrase('year'),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default Sort;
