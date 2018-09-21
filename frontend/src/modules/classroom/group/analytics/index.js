// @flow
import { h2, h3, h4, div, a, p, main } from '../../../../core/html';

import { RootComponent, Component } from '../../../../core/component';
import Header from '../../../header/root';
import Footer from '../../../footer/root';
import MainNav from '../../../nav/main';
import SecondNav from '../../../nav/second';
import InnerNav from '../../inner_nav';
import nullishCheck from '../../../../core/util';

class QuestBox extends Component {
    async render() {
        const {
            name,
            dashboardLink,
        } = this.props;

        return div(
            '.quest-box.flex-spacebetween',
            p(name),
            p(a(
                {
                    href: dashboardLink,
                    target: '_BLANK',
                    title: 'Quest specific tracking',
                },
                await window.bcnI18n.getPhrase('dashboard_link'),
            )),
        );
    }
}

class MissionBox extends Component {
    async render() {
        const {
            name,
            dashboardLink,
            quests,
        } = this.props;

        const questProms = [];
        for (const quest of quests) {
            questProms.push(new QuestBox().attach(quest));
        }

        return div(
            '.mission-box.margin-block.small-box',
            
            div(
                '.flex-spacebetween',
                h3(`${name}`),
                p(a(
                    '.link-underline.btn',
                    {
                        href: dashboardLink,
                        target: '_BLANK',
                        title: 'Mission specific tracking',
                    },
                    'Dashboard',
                )),
            ),
            div(
                '.quest-box-container',
                await Promise.all(questProms).then((el => el)),
            ),
        );
    }
}

class AnalyticsMain extends Component {
    async render() {
        const rawData = nullishCheck(window.sessionStorage.getItem('assignedAnalyticsData'), 'none');
        if (rawData === 'none') {
            console.log('[AnalyticsMain] data not in session storage');
            return h2(await window.bcnI18n.getPhrase('cr_no_analytics'));
        }

        // avoid type issues
        const glpID = parseInt(this.props.id, 10);

        const glpAnalytics = nullishCheck(JSON.parse(rawData), []);

        console.log(glpAnalytics);

        // manual linear search becuase it's not a map :(

        let theGLP = null;
        for (const glp of glpAnalytics) {
            const [id, glpObj] = glp;
            if (id === glpID) {
                theGLP = glpObj;
                break;
            }
        }

        if (nullishCheck(theGLP?.dashboardLink, '') === '') {
            console.log('[AnalyticsMain] no dashboard link');
            return h2(await window.bcnI18n.getPhrase('cr_no_analytics'));
        }

        const {
            dashboardLink,
            missions,
            name,
        } = theGLP;

        const missionProms = [];
        for (const mission of missions) {
            missionProms.push(new MissionBox().attach(mission));
        }

        return [
            div(
                '.empty-block',

                div(
                    '.flex-spacebetween',
                    h2('.upper', name),
                    p(
                        a(
                            '.btn.link-underline',
                            {
                                href: dashboardLink,
                                target: '_BLANK',
                            },
                            await window.bcnI18n.getPhrase('main_dashboard_link'),
                        ),
                    ),
                    h2('Analytics Overview'),
                ),

                p(await window.bcnI18n.getPhrase('main_dashboard_desc')),
            ),

            h3('Missions'),
            await Promise.all(missionProms).then(el => el),
        ];
    }
}

class AnalyticsOverview extends RootComponent {
    async render() {
        const header = new Header();
        const footer = new Footer();
        const mainNav = new MainNav();
        const secondNav = new SecondNav();
        const innerNav = new InnerNav();
        const mainPanel = new AnalyticsMain();

        return Promise.all([
            header.attach(),
            footer.attach(),
            mainNav.attach(),
            secondNav.attach({
                title: await window.bcnI18n.getPhrase('classroom'),
                innerNav: innerNav.attach(),
            }),
            mainPanel.attach(this.params),
        ]).then((values) => {
            const [
                headerEl,
                footerEl,
                mainNavEl,
                secondNavEl,
                mainEl,
            ] = values;

            return div(
                '#app',
                headerEl,
                div(
                    '.flex-container.expand',
                    mainNavEl,
                    secondNavEl,
                    main(
                        '#group.no-padding',
                        div(
                            '.margin-block.margin-20',
                            mainEl,
                        ),
                    ),
                ),
                footerEl,
            );
        });
    }
}

export default AnalyticsOverview;
