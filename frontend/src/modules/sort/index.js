// @flow
import { aside, p } from '../../core/html';

import { Component } from '../../core/component';

class Sort extends Component {
    async render(data: { [string]: any } = {}) {
        return aside(
            '.sort',
            p('SORT'),
        );
    }
}

export default Sort;
