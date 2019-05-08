// @flow
import { a, h3, div, span } from '../../../../core/html';

import { Component } from '../../../../core/component';
import GLPBox from './glp_box';
import nullishCheck from '../../../../core/util';

class LoadGLPs extends Component {
    state = {
        glps: [],
        endReached: false,
    };

    updateHooks = {
        SearchDone: this.handleSearch,
    };

    async init() {
        if (window.sessionStorage) {
            const obj = JSON.parse(window.sessionStorage.getItem('loaded_glps'));
            this.state.glps = obj.glps;
        }

        const { loadAll } = this.props;

        if (loadAll) {
            await this.updateAllGLPs();
            return;
        }

        await this.updateGLPs();
    }

    async handleSearch(event: CustomEvent) {
        const { detail } = event;

        const { MatchedGLPS } = detail;

        if (Array.isArray(MatchedGLPS) && MatchedGLPS.length >= 1) {
            this.removeLoadButtons();
            this.emit('SearchResultsGiven');
            this.state.glps = MatchedGLPS;
            this.updateView(await this.GLPList());

            return;
        }

        this.emit('SearchNoResults');
    }

    async updateGLPs() {
        const filterSet = this.props?.filterSet;

        const types = [];
        const orders = [];

        for (const [key, val] of filterSet) {
            // fixme
            if (val !== null) {
                types.push(key);

                // we have this null terminator here
                // so we dont confuse the backend
                // with funny placements
                orders.push(val ? val : 'null');
            }            
        }

        const typesSet = types.join(',');
        const ordersSet = orders.join(',');
        
        const index = nullishCheck(this.props?.index, 0);
        const step = nullishCheck(this.props?.step, 12);

        const glps = await window.beaconingAPI.getGLPs(typesSet, ordersSet, true, index, step);

        if (glps.length < 12) {
            this.state.endReached = true;
        }

        this.state.glps = [...this.state.glps, ...glps];
        if (window.sessionStorage) {
            window.sessionStorage.setItem('loaded_glps', JSON.stringify({ glps: this.state.glps }));
        }
    }

    async updateAllGLPs() {
        const typeQuery = nullishCheck(this.props?.type, 'default');
        const orderQuery = nullishCheck(this.props?.order, 'default');

        const glps = await window.beaconingAPI.getGLPs(typeQuery, orderQuery, true);

        this.state.glps = glps;
        if (window.sessionStorage) {
            window.sessionStorage.setItem('loaded_glps', JSON.stringify({ glps: this.state.glps }));
        }

        this.state.endReached = true;
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

    async noPlansFound() {
        return div(
            '.plans-container.list.flex-wrap',
            div(
                '.status',
                span(await window.beaconingAPI.getPhrase('lm_no_plans_found')),
            ),
        );
    }

    async GLPList() {
        const values = Object.values(this.state.glps);
        const promArr = [];
        const { currentUser } = this.props;

        // console.log(values);

        if (values.length === 0) {
            this.removeLoadButtons();

            return this.noPlansFound();
        }

        if (this.state.endReached) {
            this.removeLoadButtons();
        }

        const createPlanCard = div(
            '.glp-box.create-glp-card.flex-4',
            div(
                '.content',
                h3('.create-btn', '+'),
            ),
        );
        promArr.push(a(
            '.fake-link.create-plan-link',
            {
                href: '#new_plan',
            },
            createPlanCard,
        ));

        const trans = await window.beaconingAPI.getPhrases(
            'lm_not_rec', 'never', 'lm_owner', 'view', 'lm_assign', 'lm_created',
            'lm_domain', 'lm_mod', 'lm_topic', 'edit',
        );

        for (const glp of values) {
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
                    readOnly: glp.readOnly,
                    translationSet: trans,
                    currentUser,
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
