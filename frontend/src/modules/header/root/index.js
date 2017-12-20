// @flow

import Component from '../../../core/component';

class Header extends Component {
    async render(): Promise<string> {
        const teacherImgLink = 'dist/beaconing/images/profile.png';
        const teacherName = 'John Smith';

        return this.preparePage('header/root/templates/header', {
            teacherImgLink,
            teacherName,
        });
    }
}

export default Header;
