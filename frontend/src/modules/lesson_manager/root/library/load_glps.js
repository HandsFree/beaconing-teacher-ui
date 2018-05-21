// @flow
import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import GLPBox from './glp_box';

class LoadGLPs extends Component {
    async init() {
        const sortQuery = this.props.sort ?? 'default';
        const orderQuery = this.props.order ?? 'default';

        const glps = await window.beaconingAPI.getGLPs(sortQuery, orderQuery, true);

        this.state.glps = glps;
    }

    async render() {
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
                });

                promArr.push(glpBoxProm);
            }
        }

        return Promise.all(promArr)
            .then(elements => div('.plans-container.list.flex-wrap', elements));
    }
}

export default LoadGLPs;
