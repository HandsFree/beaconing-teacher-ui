// @flow
import { div, aside, span, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class Sort extends Component {
    initPage: string = '';

    async init() {
        const page = window.sessionStorage.getItem('library_init');

        if (page) {
            switch (page) {
            case 'science':
                this.initPage = 'science';
                break;
            case 'technology':
                this.initPage = 'technology';
                break;
            case 'engineering':
                this.initPage = 'engineering';
                break;
            case 'maths':
                this.initPage = 'maths';
                break;
            case 'addedAsc':
                this.initPage = 'addedAsc';
                break;
            case 'addedDesc':
                this.initPage = 'addedDesc';
                break;
            case 'active':
                this.initPage = 'active';
                break;
            case 'recentModAsc':
                this.initPage = 'recentModAsc';
                break;
            case 'recentModDesc':
                this.initPage = 'recentModDesc';
                break;
            case 'nameAsc':
                this.initPage = 'nameAsc';
                break;
            case 'nameDesc':
                this.initPage = 'nameDesc';
                break;
            case 'mostAssigned':
                this.initPage = 'mostAssigned';
                break;
            case 'public':
                this.initPage = 'public';
                break;
            case 'private':
                this.initPage = 'private';
                break;
            case 'ownedAsc':
                this.initPage = 'ownedAsc';
                break;
            case 'ownedDesc':
                this.initPage = 'ownedDesc';
                break;
            default:
                this.initPage = 'ownedDesc';
                break;
            }

            return;
        }

        this.initPage = 'ownedDesc';
    }

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
                    span('My Plans'),
                ),
                div(
                    '.content',
                    a(
                        this.initPage === 'ownedAsc' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'ownedAsc');
                                this.emit('SortOwnedAscClicked');
                            },
                        },
                        'Ascending',
                    ),
                    a(
                        this.initPage === 'ownedDesc' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'ownedDesc');
                                this.emit('SortOwnedDescClicked');
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
                    span('Recently Modified'),
                ),
                div(
                    '.content',
                    a(
                        this.initPage === 'recentModAsc' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'recentModAsc');
                                this.emit('SortRecentModAscGLPsClicked');
                            },
                        },
                        'Ascending',
                    ),
                    a(
                        this.initPage === 'recentModDesc' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'recentModDesc');
                                this.emit('SortRecentModDescGLPsClicked');
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
                        this.initPage === 'active' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'active');
                                this.emit('SortActiveGLPsClicked');
                            },
                            title: 'Recently Assigned GLPs',
                        },
                        'Active',
                    ),
                    a(
                        this.initPage === 'mostAssigned' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'active');
                                this.emit('SortMostAssignedClicked');
                            },
                        },
                        'Most Assigned',
                    ),
                ),
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
                        this.initPage === 'science' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'science');
                                this.emit('STEMScienceClicked');
                            },
                        },
                        'Science',
                    ),
                    a(
                        this.initPage === 'technology' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'technology');
                                this.emit('STEMTechnologyClicked');
                            },
                        },
                        'Technology',
                    ),
                    a(
                        this.initPage === 'engineering' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'engineering');
                                this.emit('STEMEngineeringClicked');
                            },
                        },
                        'Engineering',
                    ),
                    a(
                        this.initPage === 'maths' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'maths');
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
                    span('Name'),
                ),
                div(
                    '.content',
                    a(
                        this.initPage === 'nameAsc' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'nameAsc');
                                this.emit('NameAscendingClicked');
                            },
                        },
                        'Ascending',
                    ),
                    a(
                        this.initPage === 'nameDesc' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'nameDesc');
                                this.emit('NameDescendingClicked');
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
                    span('Time Added'),
                ),
                div(
                    '.content',
                    a(
                        this.initPage === 'addedAsc' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'addedAsc');
                                this.emit('RecentAscendingClicked');
                            },
                        },
                        'Ascending',
                    ),
                    a(
                        this.initPage === 'addedDesc' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'addedDesc');
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
                    span('Visibility'),
                ),
                div(
                    '.content',
                    a(
                        this.initPage === 'public' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'public');
                                this.emit('SortPublicClicked');
                            },
                        },
                        'Public',
                    ),
                    a(
                        this.initPage === 'private' ? '.sort-option.active' : '.sort-option',
                        {
                            onclick: (event) => {
                                const { target } = event;

                                this.toggleActive(target, 'private');
                                this.emit('SortPrivateClicked');
                            },
                        },
                        'Private',
                    ),
                ),
            ),
        );
    }

    toggleActive(el: EventTarget, initPage: string) {
        const asideEl = document.getElementById('library-sort');
        const active = asideEl.querySelector('.active');

        active.classList.remove('active');

        if (el.classList.contains('sort-option')) {
            el.classList.add('active');

            if (window.sessionStorage) {
                window.sessionStorage.setItem('library_init', initPage);
            }
        }
    }
}

export default Sort;
