// @flow
import { div, img, span } from '../../core/html';
import { Component } from '../../core/component';
import loadingImg from '../../images/loading.gif';

class Loading extends Component {
    msg = '';

    async init() {
        if (this.props?.msg) {
            this.msg = this.props.msg;

            return;
        }

        this.msg = await window.beaconingAPI.getPhrase('ld');
    }

    async render() {
        return div(
            '.loading-container',
            div(
                '.loading',
                img({
                    src: loadingImg,
                    alt: this.msg,
                }),
                span(`${this.msg}...`),
            ),
        );
    }
}

export default Loading;
