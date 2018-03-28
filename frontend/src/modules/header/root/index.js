// @flow

import Identicon from 'identicon.js';
import { div, header, a, img } from '../../../core/html';

import { Component } from '../../../core/component';

class Header extends Component {
    state = {
        teacherName: 'John Smith',
        teacherIMG: '',
    };

    async render() {
        const currUser = await window.beaconingAPI.getCurrentUser();

        const options = {
            foreground: [61, 177, 51, 255],
            background: [255, 255, 255, 255],
            margin: 0.1,
            size: 64,
            format: 'svg',
        };

        this.state.teacherIMG = `data:image/svg+xml;base64,${new Identicon(currUser.identiconSha512, options).toString()}`;

        return header(
            '#main-header',
            div(
                '.logo',
                a(
                    {
                        href: `//${window.location.host}/`,
                    },
                    img({
                        src: `//${window.location.host}/dist/beaconing/images/logo.png`,
                        alt: 'Click to go to Home',
                    }),
                ),
            ),
            div(
                '.profile',
                div('.logout', a(
                    {
                        href: `//${window.location.host}/auth/logout`,
                    },
                    'Log Out',
                )),
                div(
                    '.profile-img',
                    img({
                        src: this.state.teacherIMG,
                        alt: this.state.teacherName,
                    }),
                ),
            ),
        );
    }
}

export default Header;
