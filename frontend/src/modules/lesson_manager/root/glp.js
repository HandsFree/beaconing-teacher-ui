// @flow

import Component from '../../../core/component';

class GLP extends Component {
    async render(data: { [string]: any }) {
        const { name } = data;

        const renderData = {
            path: 'lesson_manager/root/templates/glp',
            locals: {
                name,
            },
        };

        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default GLP;
