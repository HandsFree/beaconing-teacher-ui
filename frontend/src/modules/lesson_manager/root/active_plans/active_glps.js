// @flow
import List from 'list.js';

import { div } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import LoadGLPs from './load_glps';

const listConfig = {
    valueNames: ['name', 'domain', 'topic', 'description'],
    indexAsync: true,
};

class ActiveGLPs extends Component {
    list: List;

    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return div('.plans.flex-column.flex-grow.margin-20', loadingEl);
    }

    async afterMount() {
        const glps = new LoadGLPs();

        const glpsEl = await glps.attach();

        const element = div('.plans.flex-column.flex-grow.margin-20', glpsEl);

        this.updateView(element);
    }

    async afterViewUpdate() {
        this.list = new List('active-glps', listConfig);
    }
}

export default ActiveGLPs;
