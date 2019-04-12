// @flow
import { section, div, p, a } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import GLPBox from './glp_box';

class AssignedGLPs extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach({
            msg: await window.beaconingAPI.getPhrase('ld_plans'),
        });

        return section(
            '.flex-column',
            loadingEl,
        );
    }

    async afterMount() {
        const { id } = this.props;
        const assignedGLPs = await window.beaconingAPI.getStudentAssigned(id, true);

        if (assignedGLPs && assignedGLPs.length >= 1) {
            const promArr = [];

            for (const glp of assignedGLPs) {
                console.log('glp! ', glp);

                const glpBox = new GLPBox();

                const glpBoxProm = glpBox.attach({
                    glpID: glp.id,
                    name: glp.name,
                    studentID: id,
                    linkId: glp.linkId,
                    fromGroupID: glp.fromStudentGroupId,
                    fromGroupName: glp.fromStudentGroupName,
                    readOnly: glp.readOnly,
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
            p(await window.beaconingAPI.getPhrase('err_no_assigned_glps')),
            a(
                '.link-underline',
                {
                    href: `//${window.location.host}/lesson_manager`,
                },
                await window.beaconingAPI.getPhrase('pc_go_library'),
            ),
        );

        this.updateView(el);
    }
}

export default AssignedGLPs;
