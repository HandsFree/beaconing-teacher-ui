// @flow
// import List from 'list.js';

import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import GLPBox from './glp_box';

/* eslint-disable no-restricted-syntax */

const listConfig = {
    valueNames: ['name', 'domain', 'topic', 'description'],
    indexAsync: true,
};

class LoadGLPs extends Component {
    // list: List;

    async render() {
        return div('.plans-container.list.flex-wrap');
    }

    async load() {
        this.state.glps = await window.beaconingAPI.getGLPs();

        const values = Object.values(this.state.glps);
        const promArr = [];

        for (const glp of values) {
            const {
                name,
                domain,
                topic,
                description,
                id,
            } = JSON.parse(glp.content);

            const glpBox = new GLPBox();

            const glpBoxProm = glpBox.attach({
                name,
                domain,
                topic,
                description,
                id,
            });

            promArr.push(glpBoxProm);
        }

        Promise.all(promArr).then((elements) => {
            for (const el of elements) {
                this.appendView(el);
            }
        });
    }

    async afterMount() {
        await this.load();

        // temporary solution
        if (this.view.parentElement) {
            const loading = this.view.parentElement.getElementsByClassName('loading-container')[0];

            this.view.parentElement.removeChild(loading);
        }

        // this.list = new List('active-glps', listConfig);
    }
}

export default LoadGLPs;
