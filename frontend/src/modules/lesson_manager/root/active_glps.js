// @flow

import { Component } from '../../../core/component';
import Loading from '../../loading';
import GLPBox from './glp_box';

class ActiveGLPs extends Component {
    async render() {
        const loading = new Loading();
        const glp = new GLPBox();

        const loadingEl = await loading.attach();
        const glpEl = await glp.attach({
            name: 'test glp',
        });

        return [
            glpEl,
            loadingEl,
        ];
    }
}

export default ActiveGLPs;
