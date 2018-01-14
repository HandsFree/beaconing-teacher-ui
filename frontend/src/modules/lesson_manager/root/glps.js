// @flow

import Component from '../../../core/component';
import Loading from '../../loading';
import GLP from './glp';

class GLPs extends Component {
    loadGLPs() {
        const glp = new GLP();

        return glp.render({
            name: 'test',
        });
    }

    async render() {
        const loading = new Loading();

        const loadingHTML = await loading.render();

        const renderData = {
            path: 'lesson_manager/root/templates/glps',
            locals: {
                glpsHTML: loadingHTML,
            },
        };

        this.prepareRenderState(this.preparePage(renderData));
        this.prepareRenderState(this.loadGLPs());
    }
}

export default GLPs;
