// @flow
import { p } from '../../../core/html';

import { Component } from '../../../core/component';

class GLPBox extends Component {
    async render(data: { [string]: any }) {
        const { name } = data;

        return p(name);
    }
}

export default GLPBox;
