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
                        tabIndex: '1',
                    },
                    i('.icon-home'),
                    span(await window.bcnI18n.getPhrase('nav_home')),
                ),
                a(
                    /^classroom/.test(path) ? '.item.active-orange' : '.item',
                    {
                        href: `//${window.location.host}/classroom/`,
                        tabIndex: 1,
                    },
                    i('.icon-graduation-cap'),
                    span(await window.bcnI18n.getPhrase('nav_classroom')),
                ),
                a(
                    /^lesson_manager/.test(path) ? '.item.active-orange' : '.item',
                    {
                        href: `//${window.location.host}/lesson_manager/`,
                        tabIndex: 1,
                    },
                    i('.icon-authoring'),
                    span(await window.bcnI18n.getPhrase('nav_lesson_manager')),
                ),
                a(
                    /^calendar/.test(path) ? '.item.active-orange' : '.item',
                    {
                        href: `//${window.location.host}/calendar/`,
                        tabIndex: 1,
                    },
                    i('.icon-calendar'),
                    span(await window.bcnI18n.getPhrase('nav_calendar')),
                ),
                a(
                    /^forum/.test(path) ? '.item.active-orange' : '.item',
                    {
                        href: 'https://forum.beaconing.eu/',
                        target: '_blank',
                        tabIndex: 1,
                    },
                    i('.icon-chat'),
                    span(await window.bcnI18n.getPhrase('nav_forum')),
                ),
            ),
            div(
                '.nav-group',
                a(
                    /^search/.test(path) ? '.item.active' : '.item',
                    {
                        href: `//${window.location.host}/search/`,
                        tabIndex: 1,
                    },
                    i('.icon-search'),
                    span(await window.bcnI18n.getPhrase('nav_search')),
                ),
                a(
                    '.item',
                    {
                        onclick: () => {
                            window.abarRuntime.open();
                        },
                        tabIndex: 1,
                    },
                    i('.icon-key-inv'),
                    span(await window.bcnI18n.getPhrase('nav_access')),
                ),
            ),
        );
    }
}

export default MainNav;
