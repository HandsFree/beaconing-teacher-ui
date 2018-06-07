// @flow
import Identicon from 'identicon.js';

import { div, header, a, img, span } from '../../../core/html';

import { Component } from '../../../core/component';

class Header extends Component {
    state = {
        teacher: {},
    };

    async init() {
        const currUser = await window.beaconingAPI.getCurrentUser();

        this.state.teacher = currUser;
    }

    async render() {
        const { teacher } = this.state;
        const teacherFirstName = teacher.teacherSettings.firstName;
        const teacherFullName = `${teacher.teacherSettings.firstName} ${teacher.teacherSettings.lastName}`;
        const options = {
            foreground: [61, 177, 51, 255],
            background: [255, 255, 255, 255],
            margin: 0.1,
            size: 64,
            format: 'svg',
        };

        const teacherIMG = `data:image/svg+xml;base64,${new Identicon(teacher.identiconSha512, options).toString()}`;

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
                        alt: await window.bcnI18n.getPhrase('logo_title'),
                    }),
                ),
            ),
            div(
                '.profile',
                div(
                    '.logout',
                    a(
                        {
                            href: `//${window.location.host}/auth/logout`,
                        },
                        await window.bcnI18n.getPhrase('log_out'),
                    ),
                ),
                div(
                    '.profile-img',
                    a(
                        {
                            href: `//${window.location.host}/profile`,
                        },
                        img({
                            src: teacherIMG,
                            alt: teacherFullName,
                        }),
                        span(teacherFirstName),
                    ),
                ),
            ),
        );
    }
}

export default Header;
