// @flow

import Component from '../../../core/component';

class SecondNav extends Component {
    async render(title: string, innerNav: Promise<string>): Promise<string> {
        const innerNavHTML: string = await innerNav;

        const renderData = {
            path: 'nav/second/templates/second_nav',
            locals: {
                title,
                innerNavHTML,
            },
        };

        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default SecondNav;
