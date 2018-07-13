// @flow
import { div, span } from '../../../../core/html';

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
        SearchDone: this.handleSearch,
    };

    async init() {
        await this.updateGLPs();
        window.more = this.loadMoreGLPs.bind(this);
    }

    async handleSearch(event: CustomEvent) {
        const { detail } = event;

        const { MatchedGLPS } = detail;

        if (Array.isArray(MatchedGLPS) && MatchedGLPS.length >= 1) {
            this.removeLoadButtons();
            this.emit('SearchResultsGiven');
            this.state.glps = MatchedGLPS;
            await this.GLPList() |> this.updateView;

            return;
        }

        this.emit('SearchNoResults');
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

    async removeLoadButtons() {
        const buttonFunc = () => {
            const loadMoreButton = document.getElementById('glpload');

            if (nullishCheck(loadMoreButton, false)) {
                loadMoreButton.style.visibility = 'hidden';

                return true;
            }

            return false;
        };

        // little ugly

        const timeoutFunc = () => {
            if (!buttonFunc()) {
                setTimeout(timeoutFunc, 100);
            }
        };

        if (document.readyState !== 'complete' || document.readyState !== 'interactive') {
            setTimeout(timeoutFunc, 100);
        }

        buttonFunc();
    }

    async loadMoreGLPs() {
        console.log(this.state);
        this.state.index += this.step;
        await this.updateGLPs();

        if (this.state.endReached) {
            this.removeLoadButtons();
        }

        await this.GLPList() |> this.updateView;
    }

    async loadAllGLPs() {
        this.state.index = 0;
        await this.updateAllGLPs();

        this.state.endReached = true;

        this.removeLoadButtons();

        await this.GLPList() |> this.updateView;
    }

    async noPlansFound() {
        return div(
            '.plans-container.list.flex-wrap',
            div(
                '.status',
                span(await window.bcnI18n.getPhrase('lm_no_plans_found')),
            ),
        );
    }

    async GLPList() {
        const values = Object.values(this.state.glps);
        const promArr = [];

        console.log(values);

        if (values.length === 0) {
            this.removeLoadButtons();

            return this.noPlansFound();
        }

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
