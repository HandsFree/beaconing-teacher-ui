// @flow
import {
    footer,
    div,
    i,
    nav,
    span,
    a,
} from '../../../core/html';

import { Component } from '../../../core/component';
import legalNotice from '../../../docs/ln.pdf';
import privPolicy from '../../../docs/pp.pdf';

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
                                title: await window.beaconingAPI.getPhrase('ft_visit_beaconing'),
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
                    span('.version', 'v0.7.0'),
                ),
                nav(
                    '.fmenu',
                    a(
                        '.item',
                        {
                            href: 'https://hfc.gitbook.io/beaconing-teacher-ui/',
                            target: '_blank',
                        },
                        await window.beaconingAPI.getPhrase('ft_support'),
                    ),
                    a(
                        '.item',
                        {
                            href: 'http://beaconing.eu/contact-us/',
                            target: '_blank',
                        },
                        await window.beaconingAPI.getPhrase('ft_cont_us'),
                    ),
                    a(
                        '.item',
                        {
                            href: legalNotice,
                            target: '_blank',
                        },
                        await window.beaconingAPI.getPhrase('ft_ln'),
                    ),
                    a(
                        '.item',
                        {
                            href: privPolicy,
                            target: '_blank',
                        },
                        await window.beaconingAPI.getPhrase('ft_pp'),
                    ),
                ),
            ),
        );
    }
}

export default Footer;
