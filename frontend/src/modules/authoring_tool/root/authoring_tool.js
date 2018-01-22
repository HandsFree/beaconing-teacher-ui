// @flow
import { div } from '../../../core/html';

import { RootComponent } from '../../../core/component';
import Prompt from './prompt';
import IFrame from './iframe';

class AuthoringTool extends RootComponent {
    params: { [string]: string } = {};

    async render() {
        const prompt = new Prompt();
        const iframe = new IFrame();

        return Promise.all([
            prompt.attach(this.params),
            iframe.attach(this.params),
        ]).then((values) => {
            const [
                promptEl,
                iframeEl,
            ] = values;

            return div(
                '.flex-column',
                promptEl,
                iframeEl,
            );
        });
    }
}

export default AuthoringTool;
