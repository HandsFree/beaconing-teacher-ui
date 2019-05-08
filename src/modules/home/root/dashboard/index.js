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
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tristique vestibulum metus sit amet varius. Vivamus rhoncus lorem ut arcu porta facilisis. Cras vel dapibus sem, vitae imperdiet arcu. Curabitur laoreet tortor ac tellus sollicitudin porta. Aenean sollicitudin velit neque, at accumsan orci tempus eget. Vestibulum pulvinar erat sapien, quis vulputate dolor blandit ut. Suspendisse eget tempus eros. Etiam vel sagittis lacus. ',
                    ),
                    p(
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tristique vestibulum metus sit amet varius. Vivamus rhoncus lorem ut arcu porta facilisis. Cras vel dapibus sem, vitae imperdiet arcu. Curabitur laoreet tortor ac tellus sollicitudin porta. Aenean sollicitudin velit neque, at accumsan orci tempus eget. Vestibulum pulvinar erat sapien, quis vulputate dolor blandit ut. Suspendisse eget tempus eros. Etiam vel sagittis lacus. ',
                    ),
                    p(
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tristique vestibulum metus sit amet varius. Vivamus rhoncus lorem ut arcu porta facilisis. Cras vel dapibus sem, vitae imperdiet arcu. Curabitur laoreet tortor ac tellus sollicitudin porta. Aenean sollicitudin velit neque, at accumsan orci tempus eget. Vestibulum pulvinar erat sapien, quis vulputate dolor blandit ut. Suspendisse eget tempus eros. Etiam vel sagittis lacus. ',
                    ),
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
