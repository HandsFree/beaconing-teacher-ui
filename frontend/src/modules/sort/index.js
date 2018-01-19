// @flow
import { p } from '../../core/html';

import { Component } from '../../core/component';

class Sort extends Component {
    async render(data: { [string]: any } = {}) {
        return p('SORT');
    }
}

export default Sort;
