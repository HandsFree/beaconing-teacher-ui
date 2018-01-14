// @flow

import Component from '../../../core/component';

class InnerNav extends Component {
    async render(): Promise<string> {
        const path = window.location.pathname.slice(1);

        const renderData = {
            path: 'lesson_manager/root/templates/inner_nav',
            locals: {
                path,
            },
        };

        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default InnerNav;
