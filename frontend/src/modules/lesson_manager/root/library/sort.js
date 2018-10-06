// @flow
import { div, aside, span, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class Sort extends Component {
    initPage: string = '';
    selectedOptions: Set = new Set();

    async init() {
        const pages = new Set([
            'science',
            'technology',
            'engineering',
            'maths',
            'addedAsc',
            'addedDesc',
            'active',
            'recentModAsc',
            'recentModDesc',
            'public',
            'private',
            'ownedAsc',
            'ownedDesc',
        ]);

        const page = window.sessionStorage.getItem('library_init');
        if (page && pages.has(page)) {
            this.initPage = page;
            return;
        }

        this.initPage = 'recentModDesc';
    }

    async render() {
        return aside(
            '#library-sort.sort.flex-column',
            div(
                '.header',
                span(await window.bcnI18n.getPhrase('sort_by')),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span(await window.bcnI18n.getPhrase('lm_my_plans')),
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
                        await window.bcnI18n.getPhrase('asc'),
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
                        await window.bcnI18n.getPhrase('desc'),
                    ),
                ),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span(await window.bcnI18n.getPhrase('lm_rm')),
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
                        await window.bcnI18n.getPhrase('asc'),
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
                        await window.bcnI18n.getPhrase('desc'),
                    ),
                ),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span(await window.bcnI18n.getPhrase('lm_status')),
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
                            title: await window.bcnI18n.getPhrase('lm_status_active_title'),
                        },
                        await window.bcnI18n.getPhrase('lm_status_active'),
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
                        await window.bcnI18n.getPhrase('lm_status_ma'),
                    ),
                ),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span(await window.bcnI18n.getPhrase('lm_stem')),
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
                        await window.bcnI18n.getPhrase('lm_science'),
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
                        await window.bcnI18n.getPhrase('lm_tech'),
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
                        await window.bcnI18n.getPhrase('lm_eng'),
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
                        await window.bcnI18n.getPhrase('lm_maths'),
                    ),
                ),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span(await window.bcnI18n.getPhrase('name')),
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
                        await window.bcnI18n.getPhrase('asc'),
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
                        await window.bcnI18n.getPhrase('desc'),
                    ),
                ),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span(await window.bcnI18n.getPhrase('lm_time_added')),
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
                        await window.bcnI18n.getPhrase('asc'),
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
                        await window.bcnI18n.getPhrase('desc'),
                    ),
                ),
            ),
            div(
                '.sort-group',
                div(
                    '.title',
                    span(await window.bcnI18n.getPhrase('lm_vis')),
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
                        await window.bcnI18n.getPhrase('lm_public'),
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
                        await window.bcnI18n.getPhrase('lm_private'),
                    ),
                ),
            ),
        );
    }

    // toggleActive will add or remove an active
    // tag to the given element.
    toggleActive(el: EventTarget, initPage: string) {
        // edge case. the current el is active and
        // we want to disable it.
        if (el.classList.contains('active')) {
            el.classList.remove('active');
            return;
        }

        // otherwise, we want to _toggle_ the active
        // element, i.e. set one to active and clear the rest.
        
        const set = el.closest('.sort-group');
        const actives = set.getElementsByClassName('active');

        console.log('the actives for ', set, ' are ', actives);

        // remove all the active tags from this set.
        for (const active of actives) {
            active.classList.remove('active');
        }

        // we have no active tag, so add it
        if (el.classList.contains('sort-option')) {
            el.classList.add('active');

            // hm!
            if (window.sessionStorage) {
                window.sessionStorage.setItem('library_init', initPage);
            }
        }
    }
}

export default Sort;
