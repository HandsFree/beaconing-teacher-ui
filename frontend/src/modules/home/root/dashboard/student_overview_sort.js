// @flow
import { div, span, a, option, select, label } from '../../../../core/html';

import { Component } from '../../../../core/component';

class Sort extends Component {
    state = {
        classes: [],
        classID: null,
        sort: null,
    };

    async init() {
        const {
            classes,
            id,
            sort,
        } = this.props;

        this.state.classes = classes;
        this.state.classID = id;
        this.state.sort = sort;

        // console.log(this.state.classID);
    }

    createClassList() {
        const options = [];

        for (const classObj of this.state.classes) {
            // console.log(typeof this.state.classID, typeof classObj.id);
            options.push(option(
                {
                    value: classObj.id,
                    selected: parseInt(this.state.classID, 10) === classObj.id,
                },
                classObj.name,
            ));
        }

        return select(
            '#so-class-list',
            {
                onchange: () => this.emit('StudentOverviewClassChange'),
            },
            options,
        );
    }

    async render() {
        return div(
            '.sorting',
            div(
                '.sort-menu',
                label(
                    '.select',
                    span('Class: '),
                    this.createClassList(),
                ),
            ),
            div(
                '#student-overview-sort.sort-menu',
                span('Sort By: '),
                a(
                    this.state.sort === 'week' ? '.active' : '',
                    {
                        onclick: () => {
                            this.emit('StudentOverviewSortWeekClicked');
                        },
                    },
                    'Week',
                ),
                a(
                    this.state.sort === 'month' ? '.active' : '',
                    {
                        onclick: () => {
                            this.emit('StudentOverviewSortMonthClicked');
                        },
                    },
                    'Month',
                ),
                a(
                    this.state.sort === 'year' ? '.active' : '',
                    {
                        onclick: () => {
                            this.emit('StudentOverviewSortYearClicked');
                        },
                    },
                    'Year',
                ),
            ),
        );
    }
}

export default Sort;
