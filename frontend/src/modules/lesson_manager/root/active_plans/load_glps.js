// @flow
import { div, span } from '../../../../core/html';

import { Component } from '../../../../core/component';
import GLPBox from './glp_box';

/* eslint-disable no-restricted-syntax */

class LoadGLPs extends Component {
    list: List;

    async init() {
        if (window.sessionStorage) {
            let sessionGLPs = window.sessionStorage.getItem('active_glps');

            if (sessionGLPs) {
                sessionGLPs = JSON.parse(sessionGLPs);

                if ((Date.now() / 1000) - (sessionGLPs.time / 1000) < 10) {
                    this.state.activeGLPs = sessionGLPs.glps;
                    return;
                }
            }

            const activeGLPs = await window.beaconingAPI.getActivePlans();

            this.state.activeGLPs = activeGLPs;
            window.sessionStorage.setItem('active_glps', JSON.stringify({
                glps: this.state.activeGLPs,
                time: Date.now(),
            }));
        }
    }

    async render() {
        const values = Object.values(this.state.activeGLPs);

        if (values.length > 0) {
            const promArr = [];

            for (const glpObj of values) {
                const {
                    name,
                    domain,
                    topic,
                    description,
                    id,
                } = JSON.parse(glpObj.glp.Content);

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

        return div(
            '.plans-container.list.flex-wrap',
            div(
                '.status',
                span('No Active Plans'),
            ),
        );
    }
}

export default LoadGLPs;
