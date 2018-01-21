// @flow

// import Identicon from 'identicon.js';
import { div, header, a, img } from '../../../core/html';

import { Component } from '../../../core/component';

class Header extends Component {
    state = {
        teacherName: 'John Smith',
        teacherIMG: 'dist/beaconing/images/profile.png',
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
                        src: 'dist/beaconing/images/logo.png',
                        alt: 'Click to go to Home',
                    }),
                ),
            ),
            div(
                '.profile',
                div('.logout', a('Log Out')),
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
