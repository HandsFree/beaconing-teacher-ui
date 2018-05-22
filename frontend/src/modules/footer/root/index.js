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
                    '.crv',
                    div(
                        '.social',
                        a(
                            {
                                title: 'Visit Beaconing',
                                href: 'http://beaconing.eu',
                            },
                            i('.icon-bcnlogo', { 'aria-hidden': true }),
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
                    span('.cr', '© Beaconing 2018'),
                    span('.version', 'v0.5.4'),
                ),
                nav(
                    '.fmenu',
                    a(
                        '.item',
                        {
                            href: 'https://hfc.gitbook.io/beaconing-teacher-ui/',
                        },
                        'Support',
                    ),
                    a(
                        '.item',
                        {
                            href: 'http://beaconing.eu/contact-us/',
                        },
                        'Contact Us',
                    ),
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
