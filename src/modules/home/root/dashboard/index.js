// @flow
import {
    div,
    main,
    section,
    h1,
    h3,
    i,
    p,
    a,
    video,
    source,
    input,
} from '../../../../core/html';

import { RootComponent, Component } from '../../../../core/component';
import Header from '../../../header/root';
import Footer from '../../../footer/root';
import MainNav from '../../../nav/main';
// import DashboardNav from './dashboard_nav';
import Widgets from './widgets';
import moment from 'moment';

import homeVideo from '../../../../videos/beaconing_video.mp4';

class BulletinMessage extends Component {
    async render() {
        const { time, author, message } = this.props;

        const timeStamp = moment(time).format("HH:MM:SS");

        return div(
            '.bulletin-message',
            div('.title', p(`${author} ${timeStamp}`)),
            div(
                '.content', 
                p(message),
            )
        );
    }
}

class DashboardBulletin extends Component {
    async render() {
        const demoMessage = new BulletinMessage();

        return Promise.all([
            demoMessage.attach({ 
                time: new Date(),
                author: 'Felix Angell', 
                message: 'The beaconing platform is great.',
            }),
        ]).then((values) => {
            const [
                demoMessageEl,
            ] = values;
            
            return div(
                '.bulletin-board',
                div(
                    '.title',
                    h3('Bulletin:'),
                ),
                div(
                    '.bulletin-response',
                    demoMessageEl,
                ),
                input(
                    '.bulletin-input',
                    {
                        type: 'text',
                        placeholder: 'Type a message',
                    },
                )
            )
        });
    }
}

class DashboardContent extends Component {
    async render() {
        const teacher = await window.beaconingAPI.getCurrentUser();
        const { firstName, lastName } = teacher.teacherSettings;

        const bulletinBoard = new DashboardBulletin();

        return Promise.all([
            bulletinBoard.attach(),
        ]).then((values) => {
            const [
                bulletinBoardEl,
            ] = values;

            return div(
                '.flex-container.flex-column',
                div('.greeting', h1(`Welcome, ${firstName}`)),

                div(
                    '.shortcuts-container',

                    a(
                        '.shortcut',
                        {
                            href: '/lesson_manager',
                            title: 'Lesson Manager',
                        },
                        div(
                            i('.icon-authoring')
                        ),
                    ),

                    a(
                        '.shortcut',
                        {
                            href: '/classroom',
                            title: 'Classroom',
                        },
                        div(
                            i('.icon-graduation-cap')
                        ),
                    ),

                    a(
                        '.shortcut',
                        {
                            href: 'search',
                            title: 'Search',
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

                bulletinBoardEl,
            );
        })
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
