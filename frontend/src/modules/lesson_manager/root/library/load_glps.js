// @flow
import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import GLPBox from './glp_box';
import nullishCheck from '../../../../core/util';

class LoadGLPs extends Component {
    step = 12;
    state = {
        index: 0,
        glps: [],
        endReached: false,
    };
    updateHooks = {
        LoadMoreClicked: this.loadMoreGLPs,
        LoadAllClicked: this.loadAllGLPs,
    };

    async init() {
        await this.updateGLPs();
        window.more = this.loadMoreGLPs.bind(this);
    }

    async updateGLPs() {
        const sortQuery = nullishCheck(this.props?.sort, 'default');
        const orderQuery = nullishCheck(this.props?.order, 'default');

        const glps = await window.beaconingAPI.getGLPs(sortQuery, orderQuery, true, this.state.index, this.step);

        if (glps.length < 12) {
            this.state.endReached = true;
        }

        this.state.glps = [...this.state.glps, ...glps];
    }

    async updateAllGLPs() {
        const sortQuery = nullishCheck(this.props?.sort, 'default');
        const orderQuery = nullishCheck(this.props?.order, 'default');

        const glps = await window.beaconingAPI.getGLPs(sortQuery, orderQuery, true);

        this.state.glps = glps;
    }

    async loadMoreGLPs() {
        this.state.index += this.step;
        await this.updateGLPs();

        if (this.state.endReached) {
            const loadMoreButton = document.getElementById('glpload');

            loadMoreButton.parentElement.removeChild(loadMoreButton);
        }

        await this.GLPList() |> this.updateView;
    }

    async loadAllGLPs() {
        this.state.index = 0;
        await this.updateAllGLPs();

        this.state.endReached = true;

        const loadMoreButton = document.getElementById('glpload');
        loadMoreButton.parentElement.removeChild(loadMoreButton);

        await this.GLPList() |> this.updateView;
    }

    async GLPList() {
        const values = Object.values(this.state.glps);
        const promArr = [];

        for (const glp of values) {
            // console.log(glp);
            if (glp) {
                const glpBox = new GLPBox();

                const glpBoxProm = glpBox.attach({
                    name: glp.name,
                    domain: glp.domain,
                    topic: glp.topic,
                    description: glp.description,
                    creationDate: glp.createdAt,
                    updateDate: glp.updatedAt,
                    id: glp.id,
                    owner: glp.owner,
                });

                promArr.push(glpBoxProm);
            }
        }

        return Promise.all(promArr)
            .then(elements => div('.plans-container.list.flex-wrap', elements));
    }

    async render() {
        return this.GLPList();
    }
}

export default LoadGLPs;
