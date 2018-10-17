// @flow
import {
    section,
    div,
    p,
    a,
} from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import GLPBox from './glp_box';
import nullishCheck from '../../../../core/util';

class LocationBasedGameAnalytics {
    id: number = 0;

    name: string = '';

    type: string = '';

    desc: string = '';

    dashboardLink: string = '';

    constructor(id: number, name: string, type: string, desc: string, dashboardLink: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.desc = desc;
        this.dashboardLink = dashboardLink;
    }
}

class SceneAnalytics {
    lbgs = [];

    id: number = 0;

    name: string = '';

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    registerLBG(lbg: LocationBasedGameAnalytics) {
        this.lbgs.push(lbg);
    }
}

class QuestAnalytics {
    name: string = '';

    dashboardLink: string = '';

    scenes = new Map();

    constructor(name: string, dashboardLink: string) {
        this.name = name;
        this.dashboardLink = dashboardLink;
    }

    registerScene(scene: SceneAnalytics) {
        this.scenes.set(scene.id, scene);
    }
}

class MissionAnalytics {
    name: string = '';

    dashboardLink: string = '';

    quests = new Map();

    constructor(name: string, dashboardLink: string) {
        this.name = name;
        this.dashboardLink = dashboardLink;
    }

    registerQuest(quest: QuestAnalytics) {
        this.quests.set(quest.name, quest);
    }

    // todo optional or something?
    findQuest(name: string) {
        return this.quests.get(name);
    }
}

class GLPAnalyticsInfo {
    id: number = 0;

    name: string = '';

    dashboardLink: string = '';

    missions = new Map();

    constructor(id: number, name: string, dashboardLink: string) {
        this.id = id;
        this.name = name;
        this.dashboardLink = dashboardLink;
    }

    registerMission(mission: MissionAnalytics) {
        this.missions.set(mission.name, mission);
    }

    findMission(name: string) {
        return this.missions.get(name);
    }
}

class AssignedGLPs extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach({
            msg: await window.bcnI18n.getPhrase('ld_plans'),
        });

        return section(
            '.flex-column',
            loadingEl,
        );
    }

    // FIXME(Felix): clean this up
    async afterMount() {
        const { id } = this.props;
        const assignedGLPs = await window.beaconingAPI.getGroupAssigned(id);

        // this is a map of the glp id's to their data
        // nodes. which will be passed along in session storage
        const glpAnalyticsNodes = new Map();

        const glps = [];

        // FIXME !
        // Need to make a GH issue for this
        // it works for now but it's very messy.

        // we're basically taking this janky json
        // format and converting it into a nice tree data structure
        // that's a bit more usable
        for (const assigned of assignedGLPs) {
            // some glps dont have this analyticsGlp available!
            if (nullishCheck(assigned?.analyticsGlp, 'none') === 'none') {
                /* eslint-disable-next-line no-continue */
                continue;
            }

            const glp = await window.beaconingAPI.getGLP(assigned.gamifiedLessonPathId, false);

            /*
                notes:

                we can ignore the analytics object for now?

                - graph.scenes : [ color? image? title? locationBasedGames ]
                -
            */

            const dashboardLink = glp?.analyticsGlp?.analytics?.json?.analytics?.dashboard;

            // FIXME
            glps.push({
                glp,
                assignedGLPID: glp.id,
                dashboardLink,
            });

            const {
                analytics: glpAnalytics,
                id: uglpID,
                missions,
                name: glpName,
            } = assigned.analyticsGlp;

            // some ids are string, some numbers
            const glpID = parseInt(uglpID, 10);

            // lovely.
            // even more lovely is that some analytics objects don't contain the 'json' field.
            // such a mess
            const mainDashboard = (glpAnalytics?.json?.analytics?.dashboard || glpAnalytics?.dashboard) ?? '';
            const glpAnalyticsObj = new GLPAnalyticsInfo(glpID, glpName, mainDashboard);

            for (const mission of missions) {
                const {
                    analytics: missionAnalytics,
                    name: missionName,
                    quests,
                } = mission;

                const missionDashboardLink = (missionAnalytics?.json?.analytics?.dashboard || missionAnalytics?.dashboard) ?? '';

                const missionAnalyticsObj = new MissionAnalytics(missionName, missionDashboardLink);
                for (const quest of quests) {
                    const {
                        analytics: questAnalytics,
                        name: questName,
                    } = quest;
                    const questDashboardLink = (questAnalytics?.json?.analytics?.dashboard || questAnalytics?.dashboard) ?? '';
                    missionAnalyticsObj.registerQuest(new QuestAnalytics(questName, questDashboardLink));
                }

                glpAnalyticsObj.registerMission(missionAnalyticsObj);
            }

            // now we have to loop through this other set
            // of glp missions/quests that are in the 'contents' of the glp.

            const glpContents = JSON.parse(glp.content);

            // four nested loops! :-)
            for (const mission of glpContents.missions) {
                const missionObj = glpAnalyticsObj.findMission(mission.name);
                // TODO report if we cant find this.

                const { quests } = mission;
                for (const quest of quests) {
                    const questObj = missionObj.findQuest(quest.name);

                    for (const scene of quest.graph.scenes) {
                        const {
                            id, title, locationBasedGames
                        } = scene;

                        const sceneItem = new SceneAnalytics(id, title);

                        for (const lbg of locationBasedGames) {
                            const {
                                id, name, type, description, analytics
                            } = lbg;

                            const dashboard = analytics?.dashboard;

                            const lbgItem = new LocationBasedGameAnalytics(id, name, type, description, dashboard);
                            sceneItem.registerLBG(lbgItem);
                        }

                        questObj.registerScene(sceneItem);
                    }
                }
            }

            // store glp id => glp data
            glpAnalyticsNodes.set(glpID, glpAnalyticsObj);
        }

        // FIXME EASY
        // we store the whole thing but we can probably just
        // store one node later on
        window.sessionStorage.setItem('assignedAnalyticsData', JSON.stringify(glpAnalyticsNodes));

        if (assignedGLPs && assignedGLPs.length >= 1) {
            const promArr = [];

            for (const glpObj of glps) {
                const glpBox = new GLPBox();

                const glpBoxProm = glpBox.attach({
                    glpID: glpObj.glp.id,
                    name: glpObj.glp.name,
                    groupID: id,
                    assignedGLPID: glpObj.assignedGLPID,
                    dashboardLink: glpObj.dashboardLink,
                });

                promArr.push(glpBoxProm);
            }

            Promise.all(promArr)
                .then((elements) => {
                    const el = div('#assigned-plans-container.flex-wrap', elements);
                    this.updateView(el);
                });

            return;
        }

        const el = div(
            '#assigned-plans-container.status.flex-column.flex-align-center',
            p(await window.bcnI18n.getPhrase('err_no_assigned_glps')),
            a(
                '.link-underline',
                {
                    href: `//${window.location.host}/lesson_manager`,
                },
                await window.bcnI18n.getPhrase('cr_go_to_lib'),
            ),
        );

        this.updateView(el);
    }
}

export default AssignedGLPs;
