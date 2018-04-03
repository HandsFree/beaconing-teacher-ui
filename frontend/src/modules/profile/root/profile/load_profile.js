// @flow
import Identicon from 'identicon.js';

import { section, figure, img, figcaption, nav, a, i } from '../../../../core/html';

import { Component } from '../../../../core/component';

class LoadProfile extends Component {
    state = {
        teacher: {},
    };

    async init() {
        const currUser = await window.beaconingAPI.getCurrentUser();

        this.state.teacher = currUser;
    }

    async render() {
        const { teacher } = this.state;
        const teacherFullName = `${teacher.teacherSettings.firstName} ${teacher.teacherSettings.lastName}`;
        const options = {
            foreground: [61, 177, 51, 255],
            background: [255, 255, 255, 255],
            margin: 0.1,
            size: 512,
            format: 'svg',
        };

        const teacherIMG = `data:image/svg+xml;base64,${new Identicon(teacher.identiconSha512, options).toString()}`;

        return section(
            '#teacher-profile-info.flex-grow.flex-column',
            nav(
                '.mini.icon-menu.flex-align-self-end',
                a(
                    {
                        href: '#edit',
                    },
                    i('.icon-pencil'),
                ),
            ),
            figure(
                img({
                    src: teacherIMG,
                    alt: teacherFullName,
                }),
                figcaption(teacherFullName),
            ),
        );
    }
}

export default LoadProfile;
