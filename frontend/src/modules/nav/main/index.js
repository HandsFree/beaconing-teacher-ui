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
                        href: './',
                    },
                    i('.icon-home'),
                    span('Home'),
                ),
                a(
                    /^classroom/.test(path) ? '.item.active-orange' : '.item',
                    {
                        href: './classroom/',
                    },
                    i('.icon-graduation-cap'),
                    span('Classroom'),
                ),
                a(
                    /^lesson_manager/.test(path) ? '.item.active-orange' : '.item',
                    {
                        href: './lesson_manager/',
                    },
                    i('.icon-authoring'),
                    span('Lesson Manager'),
                ),
                a(
                    /^calendar/.test(path) ? '.item.active' : '.item',
                    {
                        href: './calendar/',
                    },
                    i('.icon-calendar'),
                    span('Calendar'),
                ),
                a(
                    /^messages/.test(path) ? '.item.active-orange' : '.item',
                    {
                        href: './messages/',
                    },
                    i('.icon-chat'),
                    span('Messages'),
                ),
            ),
            div(
                '.nav-group',
                a(
                    /^search/.test(path) ? '.item.active' : '.item',
                    {
                        href: './search/',
                    },
                    i('.icon-search'),
                    span('Search'),
                ),
                a(
                    /^settings/.test(path) ? '.item.active' : '.item',
                    {
                        href: './settings/',
                    },
                    i('.icon-cogs'),
                    span('Classroom'),
                ),
                a(
                    '.item',
                    i('.icon-key-inv'),
                    span('Accessibility'),
                ),
            ),
        );
    }
}

export default MainNav;
