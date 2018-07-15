// @flow
import { section, div, p, a } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import GLPBox from './glp_box';

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
        const assignedGLPs = await window.beaconingAPI.getStudentAssigned(id);

        if (assignedGLPs && assignedGLPs.length >= 1) {
            const glps = [];

            for (const glp of assignedGLPs) {
                const glpObj = await window.beaconingAPI.getGLP(glp.gamifiedLessonPathId, true);

                glps.push({
                    glp: glpObj,
                    assignedGLPID: glp.id,
                });
            }

            const promArr = [];

            for (const glpObj of glps) {
                const glpBox = new GLPBox();

                const glpBoxProm = glpBox.attach({
                    glpID: glpObj.glp.id,
                    name: glpObj.glp.name,
                    studentID: id,
                    assignedGLPID: glpObj.assignedGLPID,
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
