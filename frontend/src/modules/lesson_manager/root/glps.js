// @flow

import Component from '../../../core/component';
import Loading from '../../loading';
import GLP from './glp';

class GLPs extends Component {
    loadGLPs(): AsyncIterable<string> {
        const glp = new GLP();

        return glp.render({
            name: 'test',
        });
    }

    async render(): AsyncIterable<string> {
        const loading = new Loading();

        const loadingHTML = await loading.render();

        return this.preparePage('lesson_manager/root/templates/glps', {
            glpsHTML: loadingHTML,
        }, [
            this.loadGLPs(),
        ]);
    }
}

export default GLPs;
