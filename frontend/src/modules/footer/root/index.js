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
                                target: '_blank',
                            },
                            i('.icon-bcnlogo', { 'aria-hidden': true }),
                        ),
                        a(
                            {
                                title: 'Facebook',
                                href: 'https://www.facebook.com/beaconing/',
                                target: '_blank',
                            },
                            i('.icon-facebook-official', { 'aria-hidden': true }),
                        ),
                        a(
                            {
                                title: 'Twitter',
                                href: 'https://twitter.com/BeaconingEU',
                                target: '_blank',
                            },
                            i('.icon-twitter', { 'aria-hidden': true }),
                        ),
                        a(
                            {
                                title: 'Youtube',
                                href: 'https://www.youtube.com/c/beaconingeuproject',
                                target: '_blank',
                            },
                            i('.icon-youtube-play', { 'aria-hidden': true }),
                        ),
                    ),
                    span('.cr', '© Beaconing 2018'),
                    span('.version', 'v0.6.0-pre'),
                ),
                nav(
                    '.fmenu',
                    a(
                        '.item',
                        {
                            href: 'https://hfc.gitbook.io/beaconing-teacher-ui/',
                            target: '_blank',
                        },
                        await window.bcnI18n.getPhrase('ft_support'),
                    ),
                    a(
                        '.item',
                        {
                            href: 'http://beaconing.eu/contact-us/',
                            target: '_blank',
                        },
                        await window.bcnI18n.getPhrase('ft_cont_us'),
                    ),
                    a(
                        '.item',
                        {
                            href: '#',
                        },
                        await window.bcnI18n.getPhrase('ft_tc'),
                    ),
                    a(
                        '.item',
                        {
                            href: '#',
                        },
                        await window.bcnI18n.getPhrase('ft_pp'),
                    ),
                ),
            ),
        );
    }
}

export default Footer;
