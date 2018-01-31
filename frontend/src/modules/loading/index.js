// @flow
import { div, img, span } from '../../core/html';

import { Component } from '../../core/component';

class Loading extends Component {
    async render() {
        return div(
            '.loading-container',
            div(
                '.loading',
                img({
                    src: `//${window.location.host}/dist/beaconing/images/loading.gif`,
                    alt: 'Loading',
                }),
                span('Loading...'),
            ),
        );
    }
}

export default Loading;
