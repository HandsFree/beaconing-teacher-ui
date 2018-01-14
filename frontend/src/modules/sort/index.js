// @flow

import Component from '../../core/component';

class Sort extends Component {
    async render(data: { [string]: any } = {}): Promise<string> {
        const renderData = {
            path: 'sort/templates/sort',
        };

        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default Sort;
