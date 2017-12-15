// @flow

import Component from '../../../core/component';

class MainNav extends Component {
    async render(): Promise<string> {
        const path = window.location.pathname.slice(1);

        return this.preparePage('nav/main/templates/main_nav', {
            path,
        });
    }
}

export default MainNav;
