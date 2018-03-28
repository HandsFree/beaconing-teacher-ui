// @flow
import { section, div, p } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import GLPBox from './glp_box';

class AssignedGLPs extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return section(
            '.flex-column',
            loadingEl,
        );
    }

    async afterMount() {
        const { id } = this.props;
        const assignedGLPs = await window.beaconingAPI.getStudentAssigned(id);

        console.log(assignedGLPs);

        if (assignedGLPs) {
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
            '#assigned-plans-container.status',
            p('No Assigned GLPs!'),
        );

        this.updateView(el);
    }
}

export default AssignedGLPs;
