// @flow

import Component from '../../../core/component';

class MainNav extends Component {
    async render(): Promise<string> {
        const path = window.location.pathname.slice(1);

        const renderData = {
            path: 'nav/main/templates/main_nav',
            locals: {
                path,
            },
        };

        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default MainNav;
