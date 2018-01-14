// @flow

import Component from '../../../core/component';

class Header extends Component {
    async render() {
        this.model.teacherName = 'John Smith';
        this.model.teacherImgLink = 'dist/beaconing/images/profile.png';

        const renderData = {
            path: 'header/root/templates/header',
            locals: {
                teacherImgLink: this.model.teacherName,
                teacherName: this.model.teacherImgLink,
            },
        };

        this.prepareRenderState(this.preparePage(renderData));
    }
}

export default Header;
