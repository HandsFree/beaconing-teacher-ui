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
                    span(`${await window.bcnI18n.getPhrase('group')}: `),
                    this.createClassList(),
                ),
            ),
            div(
                '#student-overview-sort.sort-menu',
                span(`${await window.bcnI18n.getPhrase('sort_by')}: `),
                a(
                    this.state.sort === 'week' ? '.active' : '',
                    {
                        onclick: () => {
                            this.emit('StudentOverviewSortWeekClicked');
                        },
                    },
                    await window.bcnI18n.getPhrase('week'),
                ),
                a(
                    this.state.sort === 'month' ? '.active' : '',
                    {
                        onclick: () => {
                            this.emit('StudentOverviewSortMonthClicked');
                        },
                    },
                    await window.bcnI18n.getPhrase('month'),
                ),
                a(
                    this.state.sort === 'year' ? '.active' : '',
                    {
                        onclick: () => {
                            this.emit('StudentOverviewSortYearClicked');
                        },
                    },
                    await window.bcnI18n.getPhrase('year'),
                ),
            ),
        );
    }
}

export default Sort;
