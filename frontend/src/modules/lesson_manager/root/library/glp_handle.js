// @flow

import { div, a, small } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import LoadGLPs from './load_glps';

class GLPHandle extends Component {
    eventsLoaded: boolean = false;

    updateHooks = {
        SortActiveGLPsClicked: this.startActiveGLPs,
        RecentDescendingClicked: this.startAddedDescendingGLPs,
        RecentAscendingClicked: this.startAddedAscendingGLPs,
        NameAscendingClicked: this.startNameAscendingGLPs,
        NameDescendingClicked: this.startNameDescendingGLPs,
        STEMScienceClicked: this.startSTEMScienceGLPs,
        STEMTechnologyClicked: this.startSTEMTechnologyGLPs,
        STEMEngineeringClicked: this.startSTEMEngineeringGLPs,
        STEMMathsClicked: this.startSTEMMathsGLPs,
        SortRecentModAscGLPsClicked: this.startRecentlyModifiedAscGLPs,
        SortRecentModDescGLPsClicked: this.startRecentlyModifiedDescGLPs,
        SortMostAssignedClicked: this.startMostAssignedGLPs,
        SortPublicClicked: this.startPublicGLPs,
        SortPrivateClicked: this.startPrivateGLPs,
        SortOwnedAscClicked: this.startOwnedAscGLPs,
        SortOwnedDescClicked: this.startOwnedDescGLPs,
    };

    emitSearchFilter(type: string, order: string) {
        const filterOptions = {
            filter: 'glp',
            sort: {
                type,
                order,
            },
        };

        this.emit('SearchFilterUpdate', filterOptions);
    }

    startAddedDescendingGLPs() {
        this.emitSearchFilter('created', 'desc');
        this.loadGLPs('created', 'desc', true);
    }

    startAddedAscendingGLPs() {
        this.emitSearchFilter('created', 'asc');
        this.loadGLPs('created', 'asc', true);
    }

    startNameAscendingGLPs() {
        this.emitSearchFilter('name', 'asc');
        this.loadGLPs('name', 'asc', true);
    }

    startNameDescendingGLPs() {
        this.emitSearchFilter('name', 'desc');
        this.loadGLPs('name', 'desc', true);
    }

    startSTEMScienceGLPs() {
        this.emitSearchFilter('stem', 'science');
        this.loadGLPs('stem', 'science', true);
    }

    startSTEMTechnologyGLPs() {
        this.emitSearchFilter('stem', 'technology');
        this.loadGLPs('stem', 'technology', true);
    }

    startSTEMEngineeringGLPs() {
        this.emitSearchFilter('stem', 'engineering');
        this.loadGLPs('stem', 'engineering', true);
    }

    startSTEMMathsGLPs() {
        this.emitSearchFilter('stem', 'maths');
        this.loadGLPs('stem', 'maths', true);
    }

    startActiveGLPs() {
        this.emitSearchFilter('assigned', '');
        this.loadGLPs('assigned', null, true);
    }

    startRecentlyModifiedAscGLPs() {
        this.emitSearchFilter('updated', 'asc');
        this.loadGLPs('updated', 'asc', true);
    }

    startRecentlyModifiedDescGLPs() {
        this.emitSearchFilter('updated', 'desc');
        this.loadGLPs('updated', 'desc', true);
    }

    startMostAssignedGLPs() {
        this.emitSearchFilter('popular', '');
        this.loadGLPs('popular', null, true);
    }

    startPublicGLPs() {
        this.emitSearchFilter('vis', 'public');
        this.loadGLPs('vis', 'public', true);
    }

    startPrivateGLPs() {
        this.emitSearchFilter('vis', 'private');
        this.loadGLPs('vis', 'private', true);
    }

    startOwnedAscGLPs() {
        this.emitSearchFilter('owned', 'asc');
        this.loadGLPs('owned', 'asc', true);
    }

    startOwnedDescGLPs() {
        this.emitSearchFilter('owned', 'desc');
        this.loadGLPs('owned', 'desc', true);
    }

    async startLoad() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        const el = div('.plans.flex-column.flex-grow.margin-20', loadingEl);

        this.updateView(el);
    }

    async loadGLPs(sort: string, order: ?string, withLoad: boolean) {
        if (withLoad) {
            this.startLoad();
        }

        const glps = new LoadGLPs();

        const glpsEl = await glps.attach({
            sort,
            order,
        });

        const element = div(
            '.plans.flex-column.flex-grow.margin-20',
            glpsEl,
            div(
                '#glpload.flex-align-center.flex-column',
                a(
                    '.button-action',
                    {
                        onclick: () => {
                            this.emit('LoadMoreClicked');
                        },
                    },
                    await window.bcnI18n.getPhrase('lm_load_more'),
                ),
                small(
                    '.pointer-hover',
                    {
                        onclick: () => {
                            this.emit('LoadAllClicked');
                        },
                    },
                    await window.bcnI18n.getPhrase('lm_load_all'),
                ),
            ),
        );

        this.updateView(element);
    }

    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return div('.plans.flex-column.flex-grow.margin-20', loadingEl);
    }

    async afterMount() {
        if (window.sessionStorage) {
            const page = window.sessionStorage.getItem('library_init');

            if (page) {
                switch (page) {
                case 'science':
                    this.emitSearchFilter('stem', 'science');
                    this.loadGLPs('stem', 'science', false);
                    break;
                case 'technology':
                    this.emitSearchFilter('stem', 'technology');
                    this.loadGLPs('stem', 'technology', false);
                    break;
                case 'engineering':
                    this.emitSearchFilter('stem', 'engineering');
                    this.loadGLPs('stem', 'engineering', false);
                    break;
                case 'maths':
                    this.emitSearchFilter('stem', 'maths');
                    this.loadGLPs('stem', 'maths', false);
                    break;
                case 'addedAsc':
                    this.emitSearchFilter('created', 'asc');
                    this.loadGLPs('created', 'asc', false);
                    break;
                case 'addedDesc':
                    this.emitSearchFilter('created', 'desc');
                    this.loadGLPs('created', 'desc', false);
                    break;
                case 'active':
                    this.emitSearchFilter('assigned', '');
                    this.loadGLPs('assigned', null, false);
                    break;
                case 'recentModAsc':
                    this.emitSearchFilter('updated', 'asc');
                    this.loadGLPs('updated', 'asc', false);
                    break;
                case 'recentModDesc':
                    this.emitSearchFilter('updated', 'desc');
                    this.loadGLPs('updated', 'desc', false);
                    break;
                case 'nameAsc':
                    this.emitSearchFilter('name', 'asc');
                    this.loadGLPs('name', 'asc', false);
                    break;
                case 'nameDesc':
                    this.emitSearchFilter('name', 'desc');
                    this.loadGLPs('name', 'desc', false);
                    break;
                case 'mostAssigned':
                    this.emitSearchFilter('popular', '');
                    this.loadGLPs('popular', null, false);
                    break;
                case 'public':
                    this.emitSearchFilter('vis', 'public');
                    this.loadGLPs('vis', 'public', false);
                    break;
                case 'private':
                    this.emitSearchFilter('vis', 'private');
                    this.loadGLPs('vis', 'private', false);
                    break;
                case 'ownedAsc':
                    this.emitSearchFilter('owned', 'asc');
                    this.loadGLPs('owned', 'asc', false);
                    break;
                case 'ownedDesc':
                    this.emitSearchFilter('owned', 'desc');
                    this.loadGLPs('owned', 'desc', false);
                    break;
                default:
                    this.loadGLPs('owned', 'desc', false);
                    break;
                }

                return;
            }
        }

        this.loadGLPs('owned', 'desc', false);
    }

    loadEvents() {
        if (!this.eventsLoaded) {
            window.addEventListener('pageshow', () => {
                this.startLoad();
                this.afterMount();
            });

            this.eventsLoaded = true;
        }
    }

    async afterViewUpdate() {
        this.loadEvents();
    }
}

export default GLPHandle;
