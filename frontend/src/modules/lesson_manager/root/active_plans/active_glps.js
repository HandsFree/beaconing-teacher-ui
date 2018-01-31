// @flow
import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import LoadGLPs from './load_glps';

class ActiveGLPs extends Component {
    async render() {
        const loading = new Loading();
        const glps = new LoadGLPs();

        const loadingEl = await loading.attach();
        const glpsEl = await glps.attach();

        return div(
            '#active-plans.flex-column.flex-grow.margin-20',
            loadingEl,
            glpsEl,
        );
    }
}

export default ActiveGLPs;
