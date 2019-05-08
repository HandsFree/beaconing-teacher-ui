// @flow
import Identicon from 'identicon.js';

import { div, section, h3, h2, img, nav, a, i } from '../../../../core/html';
import { Component } from '../../../../core/component';

import RecentActivities from './recent_activities';
import RecentlyAssigned from './recently_assigned';

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
        console.log(teacher, teacher.teacherSettings);
        const teacherFullName = `${teacher.teacherSettings.firstName} ${teacher.teacherSettings.lastName}`;
        const options = {
            foreground: [61, 177, 51, 255],
            background: [245, 245, 245, 255],
            margin: 0.1,
            size: 512,
            format: 'svg',
        };
        const teacherSchool = teacher.teacherSettings.school;

        const recentActivities = new RecentActivities();
        const recentActivitiesEl = await recentActivities.attach();

        const recentlyAssigned = new RecentlyAssigned();
        const recentlyAssignedEl = await recentlyAssigned.attach();

        const teacherIMG = `data:image/svg+xml;base64,${new Identicon(teacher.identiconSha512, options).toString()}`;

        return section(
            '#teacher-profile-info.flex-grow.flex-column',
            nav(
                '.mini.icon-menu.flex-align-self-end',
                a(
                    {
                        href: '#edit',
                        title: await window.beaconingAPI.getPhrase('edit'),
                    },
                    i('.icon-pencil'),
                ),
            ),
            div(
                '.flex-column.flex-align-start',
                div(
                    '.profile-card.flex-row.flex-align-center',
                    img({
                        src: teacherIMG,
                        alt: teacherFullName,
                    }),
                    div(
                        '.teacher-profile-info.flex-column',
                        h2(teacherFullName),
                        h3(teacherSchool),
                    )
                )
            ),
            div('.profile-widget-container',
                recentActivitiesEl,
                recentlyAssignedEl,
            )
        );
    }
}

export default LoadProfile;
