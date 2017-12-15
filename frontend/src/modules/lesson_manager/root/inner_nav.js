// @flow

import Component from '../../../core/component';

class InnerNav extends Component {
    async render(): Promise<string> {
        const path = window.location.pathname.slice(1);

        return this.preparePage('lesson_manager/root/templates/inner_nav', {
            path,
        });
    }
}

export default InnerNav;
