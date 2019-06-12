// @flow
import {
    div,
    main,
    h1,
    i,
    p,
    a,
    video,
    source,
} from '../../../../core/html';

import { RootComponent, Component } from '../../../../core/component';
import Header from '../../../header/root';
import Footer from '../../../footer/root';
import MainNav from '../../../nav/main';
import homeVideo from '../../../../videos/beaconing_video.mp4';

class DashboardContent extends Component {
    async render() {
        const teacher = await window.beaconingAPI.getCurrentUser();
        const { firstName } = teacher.teacherSettings;

        const translations = await window.beaconingAPI.getPhrases(
            'lm',
            'cr',
            'nav_search',
        );

        return div(
            '.flex-container.flex-column',
            div('.greeting', h1('', `###Welcome, ${firstName}`)),

            div(
                '.shortcuts-container',

                a(
                    '.shortcut',
                    {
                        href: '/lesson_manager',
                        title: translations.get('lm'),
                    },
                    div(
                        i('.icon-authoring')
                    ),
                ),

                a(
                    '.shortcut',
                    {
                        href: '/classroom',
                        title: translations.get('cr'),
                    },
                    div(
                        i('.icon-graduation-cap')
                    ),
                ),

                a(
                    '.shortcut',
                    {
                        href: 'search',
                        title: translations.get('nav_search'),
                    },
                    div(
                        i('.icon-search')
                    ),
                )
            ),

            div(
                '.dashboard-container',
                div('.dashboard-intro.about.margin-right-20',
                    p(
                        `
                            DMLL is leading the BEACONING project (15 partners, 3 
                            years, worth €5.9 million). This project has received funding
                            from the European Union's Horizon 2020 research and
                            innovation programme.
                        `
                    ),
                    p(
                        `
                            The project seeks to pilot such an innovation in a real operational
                            environment, aligning with DMLL's ethos in disruptive media and
                            the impact on changing mind-sets and creating new models and
                            practices of teaching and learning.
                        `
                    ),
                    p(
                        `
                            BEACONING sets a forefront in multifaceted education
                            technologies through large-scale piloting of a digital learning
                            To explore and measure platform that blend physical and digital spaces. As innovation
                            action strategies, pilots combine opportunities for new ICTs in
                            multiple ways that merge learning acquired in formal, non-formal BEACONING platform.
                        `
                    )
                ),
                div(
                    '.video-container.margin-top-20',
                    video(
                        {controls: true, autoplay: true,},
                        source(
                            {
                                src: homeVideo,
                                type: 'video/mp4',
                            }
                        )
                    )
                )
            ),
        );
    }
}

class Dashboard extends RootComponent {
    async render() {
        const header = new Header();
        const footer = new Footer();
        const mainNav = new MainNav();
        const content = new DashboardContent();

        return Promise.all([
            header.attach(),
            footer.attach(),
            mainNav.attach(),
            content.attach(),
        ]).then((values) => {
            const [
                headerEl,
                footerEl,
                mainNavEl,
                contentEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    main(
                        contentEl,
                    ),
                ),
                footerEl,
            );
        });
    }
}

export default Dashboard;
