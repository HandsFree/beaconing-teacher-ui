// @flow
import { section, div, p, a } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import GLPBox from './glp_box';
import { WSAEINVALIDPROCTABLE } from 'constants';
import nullishCheck from '../../../../core/util';

class QuestAnalytics {
    constructor(name : string, dashboardLink : string) {
        this.name = name;
        this.dashboardLink = dashboardLink;
    }
}

class MissionAnalytics {
    constructor(name : string, dashboardLink : string) {
        this.name = name;
        this.dashboardLink = dashboardLink;
        this.quests = [];
    }

    registerQuest(quest : QuestAnalytics) {
        this.quests.push(quest);
    }
}

class GLPAnalyticsInfo {
    constructor(id : number, name : string, dashboardLink : string) {
        this.id = id;
        this.name = name;
        this.dashboardLink = dashboardLink;
        this.missions = [];
    }

    registerMission(mission : MissionAnalytics) {
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

        // we're basically taking this janky json
        // format and converting it into a nice tree data structure
        // that's a bit more usable
        for (const assigned of assignedGLPs) {
            // some glps dont have this analyticsGlp available!
            if (nullishCheck(assigned.analyticsGlp, 'none') === 'none') {
                continue;
            }

            console.log("ze analyticsglp is ", assigned.analyticsGlp);
            const { 
                analytics,
                id,
                missions,
                name,
            } = assigned.analyticsGlp;

            // lovely.
            const mainDashboard = analytics?.json?.analytics?.dashboard ?? "";
            const glpAnalyticsObj = new GLPAnalyticsInfo(id, name, mainDashboard);
            
            for (const mission of missions) {
                const { 
                    analytics, 
                    description, 
                    id, 
                    name, 
                    quests,
                } = mission;

                const missionDashboardLink = analytics?.json?.analytics?.dashboard ?? "";

                const missionAnalyticsObj = new MissionAnalytics(name, missionDashboardLink);
                for (const quest of quests) {
                    const { analytics, name } = quest;
                    const questDashboardLink = analytics?.json?.analytics?.dashboard ?? "";
                    missionAnalyticsObj.registerQuest(new QuestAnalytics(name, questDashboardLink));
                }

                glpAnalyticsObj.registerMission(missionAnalyticsObj);
            }

            // store glp id => glp data
            glpAnalyticsNodes.set(id, glpAnalyticsObj);
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
