// @flow
import { div, img, span } from '../../core/html';

import { Component } from '../../core/component';

class Loading extends Component {
    async render() {
        return div(
            '.loading',
            img({
                src: 'dist/beaconing/images/loading.gif',
                alt: 'Loading',
            }),
            span('Loading...'),
        );
    }
}

export default Loading;
