// @flow

import Component from '../../core/component';

class Sort extends Component {
    async render(data: { [string]: any } = {}): Promise<string> {
        return this.preparePage('sort/templates/sort', {});
    }
}

export default Sort;
