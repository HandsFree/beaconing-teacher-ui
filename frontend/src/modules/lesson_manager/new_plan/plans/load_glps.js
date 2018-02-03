// @flow
import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import GLPBox from './glp_box';

/* eslint-disable no-restricted-syntax */

class LoadGLPs extends Component {
    list: List;

    async init() {
        if (window.sessionStorage) {
            let sessionGLPs = window.sessionStorage.getItem('glps');

            if (sessionGLPs) {
                // console.log(sessionGLP);
                sessionGLPs = JSON.parse(sessionGLPs);

                if ((Date.now() / 60000) - (sessionGLPs.time / 60000) < 1) {
                    this.state.glps = sessionGLPs.glps;
                    return;
                }
            }

            const glps = await window.beaconingAPI.getGLPs();

            this.state.glps = glps;
            window.sessionStorage.setItem('glps', JSON.stringify({
                glps: this.state.glps,
                time: Date.now(),
            }));
        }
    }

    async render() {
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

        return Promise.all(promArr)
            .then(elements => div('.plans-container.list.flex-wrap', elements));
    }
}

export default LoadGLPs;
