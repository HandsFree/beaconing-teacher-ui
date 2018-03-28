// @flow
import { div, aside, span, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class Sort extends Component {
    async render() {
        return aside(
            '#library-sort.sort.flex-column',
            div(
                '.header',
                span('Sort By:'),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span('STEM Subject'),
                ),
                div(
                    '.content',
                    a(
                        '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target);
                                this.emit('STEMScienceClicked');
                            },
                        },
                        'Science',
                    ),
                    a(
                        '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target);
                                this.emit('STEMTechnologyClicked');
                            },
                        },
                        'Technology',
                    ),
                    a(
                        '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target);
                                this.emit('STEMEngineeringClicked');
                            },
                        },
                        'Engineering',
                    ),
                    a(
                        '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target);
                                this.emit('STEMMathsClicked');
                            },
                        },
                        'Maths',
                    ),
                ),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span('Time Added'),
                ),
                div(
                    '.content',
                    a(
                        '.sort-option.active',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target);
                                this.emit('RecentAscendingClicked');
                            },
                        },
                        'Ascending',
                    ),
                    a(
                        '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target);
                                this.emit('RecentDescendingClicked');
                            },
                        },
                        'Descending',
                    ),
                ),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span('Status'),
                ),
                div(
                    '.content',
                    a(
                        '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target);
                                this.emit('SortActiveGLPsClicked');
                            },
                            title: 'Recently Assigned GLPs',
                        },
                        'Active',
                    ),
                ),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span('Name'),
                ),
                div(
                    '.content',
                    a(
                        '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target);
                                this.emit('NameAscendingClicked');
                            },
                        },
                        'Ascending',
                    ),
                    a(
                        '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target);
                                this.emit('NameDescendingClicked');
                            },
                        },
                        'Descending',
                    ),
                ),
            ),
        );
    }

    toggleActive(el: EventTarget) {
        const asideEl = document.getElementById('library-sort');
        const active = asideEl.querySelector('.active');

        active.classList.remove('active');

        if (el.classList.contains('sort-option')) {
            el.classList.add('active');
        }
    }
}

export default Sort;
