// @flow

import Component from '../../../core/component';

class BasicSearch extends Component {
    async render(data: { [string]: any }): Promise<string> {
        const { type } = data;

        return this.preparePage('search/basic/templates/basic', {
            type,
        });
    }
}

export default BasicSearch;
