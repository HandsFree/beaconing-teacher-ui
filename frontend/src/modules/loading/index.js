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
                    alt: await window.bcnI18n.getPhrase('loading'),
                }),
                span(`${await window.bcnI18n.getPhrase('loading')}...`),
            ),
        );
    }
}

export default Loading;
