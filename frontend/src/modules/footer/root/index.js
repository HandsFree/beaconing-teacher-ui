// @flow
import { footer, div, img, p, i, nav, span, a } from '../../../core/html';

import { Component } from '../../../core/component';

class Footer extends Component {
    async render() {
        return footer(
            '#main-footer',
            div(
                '.content',
                div(
                    '.info',
                    img({
                        src: `//${window.location.host}/dist/beaconing/images/logo.png`,
                        alt: 'Beaconing',
                    }),
                    p('Find out more about Beaconing:'),
                    div(
                        '.social',
                        a(
                            {
                                title: 'Visit Beaconing',
                                href: 'http://beaconing.eu',
                            },
                            i('.icon-link-ext-alt', { 'aria-hidden': true }),
                        ),
                        a(
                            {
                                title: 'Facebook',
                                href: 'https://www.facebook.com/beaconing/',
                            },
                            i('.icon-facebook-official', { 'aria-hidden': true }),
                        ),
                        a(
                            {
                                title: 'Twitter',
                                href: 'https://twitter.com/BeaconingEU',
                            },
                            i('.icon-twitter', { 'aria-hidden': true }),
                        ),
                        a(
                            {
                                title: 'Youtube',
                                href: 'https://www.youtube.com/c/beaconingeuproject',
                            },
                            i('.icon-youtube-play', { 'aria-hidden': true }),
                        ),
                    ),
                ),
                nav(
                    '.links',
                    div(
                        '.link-group',
                        span('.title', 'Pages'),
                        a(
                            '.item',
                            {
                                href: `//${window.location.host}/`,
                            },
                            'Home',
                        ),
                        a(
                            '.item',
                            {
                                href: `//${window.location.host}/classroom/`,
                            },
                            'Students',
                        ),
                        a(
                            '.item',
                            {
                                href: `//${window.location.host}/groups/`,
                            },
                            'Groups',
                        ),
                        a(
                            '.item',
                            {
                                href: `//${window.location.host}/lesson_manager/`,
                            },
                            'Library',
                        ),
                        a(
                            '.item',
                            {
                                href: `//${window.location.host}/calendar/`,
                            },
                            'Calendar',
                        ),
                        a(
                            '.item',
                            {
                                href: '#',
                            },
                            'Forum',
                        ),
                        a(
                            '.item',
                            {
                                href: `//${window.location.host}/search/`,
                            },
                            'Search',
                        ),
                    ),
                    div(
                        '.link-group',
                        span('.title', 'Support'),
                        a(
                            '.item',
                            {
                                href: 'https://hfc.gitbook.io/beaconing-teacher-ui/',
                            },
                            'Documentation',
                        ),
                        a(
                            '.item',
                            {
                                href: 'http://beaconing.eu/contact-us/',
                            },
                            'Contact Us',
                        ),
                    ),
                ),
            ),
            div(
                '.lower',
                div(
                    '.crv',
                    span('.cr', '© Beaconing 2018'),
                    span('.version', 'v0.5.4'),
                ),
                nav(
                    '.legal',
                    a(
                        '.item',
                        {
                            href: '#',
                        },
                        'Terms and Conditions',
                    ),
                    a(
                        '.item',
                        {
                            href: '#',
                        },
                        'Privacy Policy',
                    ),
                ),
            ),
        );
    }
}

export default Footer;
