// @flow

import Component from '../../../core/component';

class BasicSearch extends Component {
    async render(data: { [string]: any }): Promise<string> {
        const { type } = data;

        const renderData = {
            path: 'search/basic/templates/basic',
            locals: {
                type,
            },
        };

        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default BasicSearch;
