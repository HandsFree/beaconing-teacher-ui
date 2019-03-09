// @flow
import { h2, h3, h4, h5, div, a, p, main } from '../../../../core/html';

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
            scenes,
        } = this.props;

        const sceneList = [];
        const noAnMsg = await window.beaconingAPI.getPhrase('cr_no_analytics');
        const dashMsg = await window.beaconingAPI.getPhrase('an_dashboard');
        const dashTitleMsg = await window.beaconingAPI.getPhrase('an_lbg_dash_title');

        for (const [id, scene] of scenes) {
            const {
                lbgs,
                name: sceneName,
            } = scene;

            const lbgList = [];
            for (const lbg of lbgs) {
                const {
                    desc,
                    type,
                    dashboardLink: lbgDL,
                } = lbg;

                let { name: lbgName } = lbg;

                if (type) {
                    lbgName += ` -  ${type}`;
                }

                const dashboardLinkEl = p(a(
                    '.link-underline.btn',
                    {
                        href: lbgDL,
                        target: '_BLANK',
                        title: dashTitleMsg,
                    },
                    dashMsg,
                ));

                const lbgEl = div(
                    '.empty-block',
                    p(lbgName),
                    nullishCheck(lbgDL, false) ? dashboardLinkEl : p(noAnMsg),
                    p(desc),
                );

                lbgList.push(lbgEl);
            }

            // we only add the scene
            // if at has some LBGs which have dashboard links!
            if (lbgList.length > 0) {
                sceneList.push(
                    div(
                        '.empty-block.scene-box',
                        h5(sceneName),
                        lbgList,
                    ),
                );
            }
        }

        return div(
            '.quest-box',

            div(
                '.flex-spacebetween',
                h3(name),
                p(a(
                    '.btn.link-underline',
                    {
                        href: dashboardLink,
                        target: '_BLANK',
                        title: await window.beaconingAPI.getPhrase('an_scenes_dash_title'),
                    },
                    await window.beaconingAPI.getPhrase('an_dashboard'),
                )),
            ),

            // we only show this section
            // if there are scenes.
            sceneList.length > 0 ? div(
                '.margin-block',
                h4(await window.beaconingAPI.getPhrase('an_scenes')),
                p(await window.beaconingAPI.getPhrase('an_scenes_desc')),
                div('.scenes-container', sceneList),
            ) : [],
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
        for (const [qname, quest] of quests) {
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
                        title: await window.beaconingAPI.getPhrase('an_mission_dash_title'),
                    },
                    await window.beaconingAPI.getPhrase('an_dashboard'),
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
            return h2(await window.beaconingAPI.getPhrase('cr_no_analytics'));
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
            return h2(await window.beaconingAPI.getPhrase('cr_no_analytics'));
        }

        const {
            dashboardLink,
            missions,
            name,
        } = theGLP;

        const missionProms = [];
        for (const [name, mission] of missions) {
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
                            await window.beaconingAPI.getPhrase('an_main_dashboard_link'),
                        ),
                    ),
                    h2(await window.beaconingAPI.getPhrase('analytics')),
                ),

                p(await window.beaconingAPI.getPhrase('an_main_dashboard_desc')),
            ),

            h2(await window.beaconingAPI.getPhrase('lm_missions')),
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
                title: await window.beaconingAPI.getPhrase('cr'),
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
