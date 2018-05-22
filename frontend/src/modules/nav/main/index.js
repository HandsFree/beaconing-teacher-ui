// @flow
import { div, nav, a, i, span } from '../../../core/html';

import { Component } from '../../../core/component';

class MainNav extends Component {
    state = {
        path: window.location.pathname.slice(1),
    };

    async render() {
        const { path } = this.state;

        return nav(
            '#main',
            div(
                '.nav-group',
                a(
                    path === '' ? '.item.active' : '.item',
                    {
                        href: `//${window.location.host}/`,
                    },
                    i('.icon-home'),
                    span('Home'),
                ),
                a(
                    /^classroom/.test(path) ? '.item.active-orange' : '.item',
                    {
                        href: `//${window.location.host}/classroom/`,
                    },
                    i('.icon-graduation-cap'),
                    span('Classroom'),
                ),
                a(
                    /^lesson_manager/.test(path) ? '.item.active-orange' : '.item',
                    {
                        href: `//${window.location.host}/lesson_manager/`,
                    },
                    i('.icon-authoring'),
                    span('Lesson Manager'),
                ),
                a(
                    /^calendar/.test(path) ? '.item.active' : '.item',
                    {
                        href: `//${window.location.host}/calendar/`,
                    },
                    i('.icon-calendar'),
                    span('Calendar'),
                ),
                a(
                    /^forum/.test(path) ? '.item.active-orange' : '.item',
                    // {
                    //     href: `//${window.location.host}/forum/`,
                    // },
                    i('.icon-chat'),
                    span('Forum'),
                ),
            ),
            div(
                '.nav-group',
                a(
                    /^search/.test(path) ? '.item.active' : '.item',
                    {
                        href: `//${window.location.host}/search/`,
                    },
                    i('.icon-search'),
                    span('Search'),
                ),
                // a(
                //     '.item',
                //     {
                //         href: 'https://hfc.gitbook.io/beaconing-teacher-ui/',
                //         target: '_blank',
                //     },
                //     i('.icon-help'),
                //     span('Help'),
                // ),
                a(
                    '.item',
                    {
                        onclick: () => {
                            window.abarRuntime.open();
                        },
                    },
                    i('.icon-key-inv'),
                    span('Accessibility'),
                ),
            ),
        );
    }
}

export default MainNav;
