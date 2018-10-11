// @flow
import { div, img, span } from '../../core/html';

import { Component } from '../../core/component';

class Loading extends Component {
    msg = '';

    async init() {
        if (this.props?.msg) {
            this.msg = this.props.msg;

            return;
        }

        this.msg = await window.bcnI18n.getPhrase('ld');
    }

    async render() {
        return div(
            '.loading-container',
            div(
                '.loading',
                img({
                    src: `//${window.location.host}/dist/beaconing/images/loading.gif`,
                    alt: this.msg,
                }),
                span(`${this.msg}...`),
            ),
        );
    }
}

export default Loading;
