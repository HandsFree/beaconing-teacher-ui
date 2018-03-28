// @flow
import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import GLPBox from './glp_box';

class LoadGLPs extends Component {
    async init() {
        const sortQuery = this.props.sort || 'default';
        const orderQuery = this.props.order || 'default';

        const glps = await window.beaconingAPI.getGLPs(sortQuery, orderQuery);

        this.state.glps = glps;

        // Tends to exceed storage quota

        // if (window.sessionStorage) {
        //     const key = `glps_${sortQuery}_${orderQuery}`;
        //     console.log(key);
        //     let sessionGLPs = window.sessionStorage.getItem(key);

        //     if (sessionGLPs) {
        //         // console.log(sessionGLP);
        //         sessionGLPs = JSON.parse(sessionGLPs);

        //         if ((Date.now() / 1000) - (sessionGLPs.time / 1000) < 10) {
        //             this.state.glps = sessionGLPs.glps;
        //             return;
        //         }
        //     }

        //     const glps = await window.beaconingAPI.getGLPs(sortQuery, orderQuery);

        //     this.state.glps = glps;
        //     window.sessionStorage.setItem(key, JSON.stringify({
        //         glps: this.state.glps,
        //         time: Date.now(),
        //     }));
        // }
    }

    async render() {
        const values = Object.values(this.state.glps);
        const promArr = [];

        for (const glp of values) {
            // console.log(glp);
            if (glp.content) {
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
        }

        return Promise.all(promArr)
            .then(elements => div('.plans-container.list.flex-wrap', elements));
    }
}

export default LoadGLPs;
