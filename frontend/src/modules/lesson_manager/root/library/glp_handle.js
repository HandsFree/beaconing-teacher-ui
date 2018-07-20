// @flow

import { div, a, small } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import LoadGLPs from './load_glps';

class GLPHandle extends Component {
    step = 12;

    index: 0;

    loadAll = false;

    eventsLoaded: boolean = false;

    filterOptions: ?Object = null;

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

        this.filterOptions = filterOptions;

        this.emit('SearchFilterUpdate', filterOptions);

        if (window.sessionStorage) {
            window.sessionStorage.setItem('loaded_glps', JSON.stringify({ glps: [] }));
        }

        this.index = 0;
    }

    startAddedDescendingGLPs() {
        this.emitSearchFilter('created', 'desc');
        this.loadGLPs(true);
    }

    startAddedAscendingGLPs() {
        this.emitSearchFilter('created', 'asc');
        this.loadGLPs(true);
    }

    startNameAscendingGLPs() {
        this.emitSearchFilter('name', 'asc');
        this.loadGLPs(true);
    }

    startNameDescendingGLPs() {
        this.emitSearchFilter('name', 'desc');
        this.loadGLPs(true);
    }

    startSTEMScienceGLPs() {
        this.emitSearchFilter('stem', 'science');
        this.loadGLPs(true);
    }

    startSTEMTechnologyGLPs() {
        this.emitSearchFilter('stem', 'technology');
        this.loadGLPs(true);
    }

    startSTEMEngineeringGLPs() {
        this.emitSearchFilter('stem', 'engineering');
        this.loadGLPs(true);
    }

    startSTEMMathsGLPs() {
        this.emitSearchFilter('stem', 'maths');
        this.loadGLPs(true);
    }

    startActiveGLPs() {
        this.emitSearchFilter('assigned', '');
        this.loadGLPs(true);
    }

    startRecentlyModifiedAscGLPs() {
        this.emitSearchFilter('updated', 'asc');
        this.loadGLPs(true);
    }

    startRecentlyModifiedDescGLPs() {
        this.emitSearchFilter('updated', 'desc');
        this.loadGLPs(true);
    }

    startMostAssignedGLPs() {
        this.emitSearchFilter('popular', '');
        this.loadGLPs(true);
    }

    startPublicGLPs() {
        this.emitSearchFilter('vis', 'public');
        this.loadGLPs(true);
    }

    startPrivateGLPs() {
        this.emitSearchFilter('vis', 'private');
        this.loadGLPs(true);
    }

    startOwnedAscGLPs() {
        this.emitSearchFilter('owned', 'asc');
        this.loadGLPs(true);
    }

    startOwnedDescGLPs() {
        this.emitSearchFilter('owned', 'desc');
        this.loadGLPs(true);
    }

    async loadMoreGLPs() {
        this.index += this.step;
        this.loadAll = false;
        this.loadGLPs(false);
    }

    async loadAllGLPs() {
        this.index = 0;
        this.loadAll = true;
        this.loadGLPs(false);
    }

    async startLoad() {
        const loading = new Loading();

        const loadingEl = await loading.attach({
            msg: await window.bcnI18n.getPhrase('ld_plans'),
        });

        const el = div('.plans.flex-column.flex-grow.margin-20', loadingEl);

        this.updateView(el);
    }

    async loadGLPs(withLoad: boolean) {
        if (withLoad) {
            this.startLoad();
        }

        const glps = new LoadGLPs();

        const {
            type,
            order,
        } = this.filterOptions.sort;

        const glpsEl = await glps.attach({
            type,
            order,
            loadAll: this.loadAll,
            index: this.index,
            step: this.step,
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
                            this.loadMoreGLPs();
                        },
                    },
                    await window.bcnI18n.getPhrase('lm_load_more'),
                ),
                small(
                    '.pointer-hover',
                    {
                        onclick: () => {
                            this.loadAllGLPs();
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

        const loadingEl = await loading.attach({
            msg: await window.bcnI18n.getPhrase('ld_plans'),
        });

        return div('.plans.flex-column.flex-grow.margin-20', loadingEl);
    }

    async afterMount() {
        if (window.sessionStorage) {
            const page = window.sessionStorage.getItem('library_init');

            if (page) {
                switch (page) {
                case 'science':
                    this.emitSearchFilter('stem', 'science');
                    this.loadGLPs(false);
                    break;
                case 'technology':
                    this.emitSearchFilter('stem', 'technology');
                    this.loadGLPs(false);
                    break;
                case 'engineering':
                    this.emitSearchFilter('stem', 'engineering');
                    this.loadGLPs(false);
                    break;
                case 'maths':
                    this.emitSearchFilter('stem', 'maths');
                    this.loadGLPs(false);
                    break;
                case 'addedAsc':
                    this.emitSearchFilter('created', 'asc');
                    this.loadGLPs(false);
                    break;
                case 'addedDesc':
                    this.emitSearchFilter('created', 'desc');
                    this.loadGLPs(false);
                    break;
                case 'active':
                    this.emitSearchFilter('assigned', '');
                    this.loadGLPs(false);
                    break;
                case 'recentModAsc':
                    this.emitSearchFilter('updated', 'asc');
                    this.loadGLPs(false);
                    break;
                case 'recentModDesc':
                    this.emitSearchFilter('updated', 'desc');
                    this.loadGLPs(false);
                    break;
                case 'nameAsc':
                    this.emitSearchFilter('name', 'asc');
                    this.loadGLPs(false);
                    break;
                case 'nameDesc':
                    this.emitSearchFilter('name', 'desc');
                    this.loadGLPs(false);
                    break;
                case 'mostAssigned':
                    this.emitSearchFilter('popular', '');
                    this.loadGLPs(false);
                    break;
                case 'public':
                    this.emitSearchFilter('vis', 'public');
                    this.loadGLPs(false);
                    break;
                case 'private':
                    this.emitSearchFilter('vis', 'private');
                    this.loadGLPs(false);
                    break;
                case 'ownedAsc':
                    this.emitSearchFilter('owned', 'asc');
                    this.loadGLPs(false);
                    break;
                case 'ownedDesc':
                    this.emitSearchFilter('owned', 'desc');
                    this.loadGLPs(false);
                    break;
                default:
                    this.emitSearchFilter('updated', 'desc');
                    this.loadGLPs(false);
                    break;
                }

                return;
            }
        }

        this.emitSearchFilter('updated', 'desc');
        this.loadGLPs(false);
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
