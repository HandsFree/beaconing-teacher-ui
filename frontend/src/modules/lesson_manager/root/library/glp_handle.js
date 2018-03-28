// @flow
import List from 'list.js';

import { div } from '../../../../core/html';

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
    };

    startAddedDescendingGLPs() {
        this.loadGLPs('created', 'desc');
    }

    startAddedAscendingGLPs() {
        this.loadGLPs('created', 'asc');
    }

    startNameAscendingGLPs() {
        this.loadGLPs('name', 'asc');
    }

    startNameDescendingGLPs() {
        this.loadGLPs('name', 'desc');
    }

    startSTEMScienceGLPs() {
        this.loadGLPs('stem', 'science');
    }

    startSTEMTechnologyGLPs() {
        this.loadGLPs('stem', 'technology');
    }

    startSTEMEngineeringGLPs() {
        this.loadGLPs('stem', 'engineering');
    }

    startSTEMMathsGLPs() {
        this.loadGLPs('stem', 'maths');
    }

    startActiveGLPs() {
        this.loadGLPs('assigned', null);
    }

    startRecentlyModifiedAscGLPs() {
        this.loadGLPs('updated', 'asc');
    }

    startRecentlyModifiedDescGLPs() {
        this.loadGLPs('updated', 'desc');
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

    async loadGLPs(sort: string, order: ?string) {
        this.startLoad();

        const glps = new LoadGLPs();

        const glpsEl = await glps.attach({
            sort,
            order,
        });

        const element = div('.plans.flex-column.flex-grow.margin-20', glpsEl);

        this.updateView(element);
    }

    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return div('.plans.flex-column.flex-grow.margin-20', loadingEl);
    }

    async afterMount() {
        const glps = new LoadGLPs();

        const glpsEl = await glps.attach({
            sort: 'created',
            order: 'asc',
        });

        const element = div('.plans.flex-column.flex-grow.margin-20', glpsEl);

        this.updateView(element);
    }

    async afterViewUpdate() {
        this.list = new List('new-plans', listConfig);
    }
}

export default GLPHandle;
