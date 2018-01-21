// @flow
import { div } from '../../../core/html';

import { Component } from '../../../core/component';
import GLPBox from './glp_box';

/* eslint-disable no-restricted-syntax */

class LoadGLPs extends Component {
    async render() {
        return div('.plans-container.flex-wrap');
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
            } = JSON.parse(glp.content);

            const glpBox = new GLPBox();

            const glpBoxProm = glpBox.attach({
                name,
                domain,
                topic,
                description,
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
    }
}

export default LoadGLPs;
