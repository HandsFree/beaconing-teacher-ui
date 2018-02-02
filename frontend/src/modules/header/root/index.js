// @flow

// import Identicon from 'identicon.js';
import { div, header, a, img } from '../../../core/html';

import { Component } from '../../../core/component';

class Header extends Component {
    state = {
        teacherName: 'John Smith',
        teacherIMG: `//${window.location.host}/dist/beaconing/images/profile.png`,
    };

    async render() {
        return header(
            '#main-header',
            div(
                '.logo',
                a(
                    {
                        href: './',
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
                            src: this.state.teacherIMG,
                            alt: this.state.teacherName,
                        },
                    ),
                ),
            ),
        );
    }
}

export default Header;
