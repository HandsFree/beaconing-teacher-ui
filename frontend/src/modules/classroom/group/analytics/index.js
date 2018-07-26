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
            '.small-box',
            p(name),
            p(a(
                {
                    href: dashboardLink,
                    target: '_BLANK',
                },
                'Dashboard Link',
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
            '.mission-box.margin-block',
            h3(`${name}`),
            p(a(
                '.link-underline',
                {
                    href: dashboardLink,
                    target: '_BLANK',
                },
                'Mission Dashboard Link',
            )),

            h4('Quests:'),
            div(
                '.flex-spacebetween.flex-align-stretch.flex-grow',
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


        console.log(theGLP);

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
                h2(`Analytics Overview: ${name}`),
                p(
                    a(
                        '.link-underline',
                        {
                            href: dashboardLink,
                            target: '_BLANK',
                        },
                        'Main Dashboard Link',
                    ),
                ),
            ),
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
                            '.margin-block',
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
