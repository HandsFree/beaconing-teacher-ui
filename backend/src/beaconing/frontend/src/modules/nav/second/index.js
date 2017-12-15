// @flow

import Component from '../../../core/component';

class SecondNav extends Component {
    async render(title: string, innerNav: Promise<string>): Promise<string> {
        const innerNavHTML: string = await innerNav;

        return this.preparePage('nav/second/templates/second_nav', {
            title,
            innerNavHTML,
        });
    }
}

export default SecondNav;
