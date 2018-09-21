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

class QuestAnalytics {
    constructor(name: string, dashboardLink: string) {
        this.name = name;
        this.dashboardLink = dashboardLink;
    }
}

class MissionAnalytics {
    constructor(name: string, dashboardLink: string) {
        this.name = name;
        this.dashboardLink = dashboardLink;
        this.quests = [];
    }

    registerQuest(quest: QuestAnalytics) {
        this.quests.push(quest);
    }
}

class GLPAnalyticsInfo {
    constructor(id: number, name: string, dashboardLink: string) {
        this.id = id;
        this.name = name;
        this.dashboardLink = dashboardLink;
        this.missions = [];
    }

    registerMission(mission: MissionAnalytics) {
        this.missions.push(mission);
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

    async afterMount() {
        const { id } = this.props;
        const assignedGLPs = await window.beaconingAPI.getGroupAssigned(id);

        const glpAnalyticsNodes = new Map();

        // FIXME !
        // Need to make a GH issue for this
        // it works for now but it's very messy.

        // we're basically taking this janky json
        // format and converting it into a nice tree data structure
        // that's a bit more usable
        for (const assigned of assignedGLPs) {
            // some glps dont have this analyticsGlp available!
            if (nullishCheck(assigned?.analyticsGlp, 'none') === 'none') {
                continue;
            }

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

            // store glp id => glp data
            glpAnalyticsNodes.set(glpID, glpAnalyticsObj);
        }

        // FIXME EASY
        // we store the whole thing but we can probably just
        // store one node later on
        window.sessionStorage.setItem('assignedAnalyticsData', JSON.stringify(glpAnalyticsNodes));

        if (assignedGLPs && assignedGLPs.length >= 1) {
            const glps = [];

            for (const glp of assignedGLPs) {
                const glpObj = await window.beaconingAPI.getGLP(glp.gamifiedLessonPathId, true);
                const dashboardLink = glp?.analyticsGlp?.analytics?.json?.analytics?.dashboard;

                glps.push({
                    glp: glpObj,
                    assignedGLPID: glp.id,
                    dashboardLink,
                });
            }

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
            p(await window.bcnI18n.getPhrase('no_assigned_glps')),
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
