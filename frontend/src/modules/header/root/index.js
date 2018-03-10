// @flow

// import Identicon from 'identicon.js';
import { div, header, a, img } from '../../../core/html';

import { Component } from '../../../core/component';

var Identicon = require('identicon.js');

class Header extends Component {
    state = {
        teacherName: 'John Smith',
        teacherIMG: `//${window.location.host}/dist/beaconing/images/profile.png`,
    };

    async render() {
        const currUser = await window.beaconingAPI.getCurrentUser();
        const data = "";

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
                    img(
                        '.profile-blue',
                        {
                            src: `data:image/png;base64,${data}`,
                            alt: this.state.teacherName,
                        },
                    ),
                ),
            ),
        );
    }
}

export default Header;
