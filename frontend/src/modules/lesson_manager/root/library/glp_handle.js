// @flow
import List from 'list.js';

import { div, a } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import LoadGLPs from './load_glps';

const listConfig = {
    valueNames: ['name', 'domain', 'topic', 'description'],
    indexAsync: true,
};

class GLPHandle extends Component {
    list: List;

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

    startAddedDescendingGLPs() {
        this.loadGLPs('created', 'desc', true);
    }

    startAddedAscendingGLPs() {
        this.loadGLPs('created', 'asc', true);
    }

    startNameAscendingGLPs() {
        this.loadGLPs('name', 'asc', true);
    }

    startNameDescendingGLPs() {
        this.loadGLPs('name', 'desc', true);
    }

    startSTEMScienceGLPs() {
        this.loadGLPs('stem', 'science', true);
    }

    startSTEMTechnologyGLPs() {
        this.loadGLPs('stem', 'technology', true);
    }

    startSTEMEngineeringGLPs() {
        this.loadGLPs('stem', 'engineering', true);
    }

    startSTEMMathsGLPs() {
        this.loadGLPs('stem', 'maths', true);
    }

    startActiveGLPs() {
        this.loadGLPs('assigned', null, true);
    }

    startRecentlyModifiedAscGLPs() {
        this.loadGLPs('updated', 'asc', true);
    }

    startRecentlyModifiedDescGLPs() {
        this.loadGLPs('updated', 'desc', true);
    }

    startMostAssignedGLPs() {
        this.loadGLPs('popular', null, true);
    }

    startPublicGLPs() {
        this.loadGLPs('vis', 'public', true);
    }

    startPrivateGLPs() {
        this.loadGLPs('vis', 'private', true);
    }

    startOwnedAscGLPs() {
        this.loadGLPs('owned', 'asc', true);
    }

    startOwnedDescGLPs() {
        this.loadGLPs('owned', 'desc', true);
    }

    async startLoad() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        const el = div('.plans.flex-column.flex-grow.margin-20', loadingEl);

        this.updateView(el);
    }

    // async startActiveGLPs() {
    //     this.startLoad();

    //     const glps = new ActiveGLPs();

    //     const glpsEl = await glps.attach();

    //     const element = div('.plans.flex-column.flex-grow.margin-20', glpsEl);

    //     this.updateView(element);
    // }

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
                '#glpload.flex-justify-center',
                a(
                    '.button-action',
                    {
                        onclick: () => {
                            this.emit('LoadMoreClicked');
                        },
                    },
                    'Load More',
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
                    this.loadGLPs('stem', 'science', false);
                    break;
                case 'technology':
                    this.loadGLPs('stem', 'technology', false);
                    break;
                case 'engineering':
                    this.loadGLPs('stem', 'engineering', false);
                    break;
                case 'maths':
                    this.loadGLPs('stem', 'maths', false);
                    break;
                case 'addedAsc':
                    this.loadGLPs('created', 'asc', false);
                    break;
                case 'addedDesc':
                    this.loadGLPs('created', 'desc', false);
                    break;
                case 'active':
                    this.loadGLPs('assigned', null, false);
                    break;
                case 'recentModAsc':
                    this.loadGLPs('updated', 'asc', false);
                    break;
                case 'recentModDesc':
                    this.loadGLPs('updated', 'desc', false);
                    break;
                case 'nameAsc':
                    this.loadGLPs('name', 'asc', false);
                    break;
                case 'nameDesc':
                    this.loadGLPs('name', 'desc', false);
                    break;
                case 'mostAssigned':
                    this.loadGLPs('popular', null, false);
                    break;
                case 'public':
                    this.loadGLPs('vis', 'public', false);
                    break;
                case 'private':
                    this.loadGLPs('vis', 'private', false);
                    break;
                case 'ownedAsc':
                    this.loadGLPs('owned', 'asc', false);
                    break;
                case 'ownedDesc':
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

    async afterViewUpdate() {
        this.list = new List('new-plans', listConfig);
    }
}

export default GLPHandle;
