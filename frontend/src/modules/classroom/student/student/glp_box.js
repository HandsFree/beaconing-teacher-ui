// @flow
import {
    div,
    a,
    h3,
    h4,
} from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

class GLPBox extends Component {
    async render() {
        const {
            name,
            glpID,
            fromGroupName,
        } = this.props;

        return div(
            '.glp-assigned-box.flex-4.flex-column',
            div(
                '.title',
                div(
                    '.flex-column',
                    h3('.name', name),
                    fromGroupName ? h4('.group', `From group: ${fromGroupName}`) : [],
                ),
            ),
            div(
                '.toolbar',
                a(
                    '.item',
                    {
                        href: `//${window.location.host}/lesson_manager#view?id=${glpID}`,
                    },
                    await window.bcnI18n.getPhrase('view'),
                ),
                a(
                    '.item',
                    {
                        onclick: () => {
                            this.unassignPlan();
                        },
                    },
                    await window.bcnI18n.getPhrase('cr_unassign'),
                ),
            ),
        );
    }

    async unassignPlan() {
        const unassignGLPTransl = await window.bcnI18n.getPhrase('con_unassign_glp');
        if (!confirm(unassignGLPTransl)) {
            return;
        }

        const {
            assignedGLPID,
            studentID,
        } = this.props;

        const status = await window.beaconingAPI.unassignStudent(studentID, assignedGLPID);
        const statusMessage = new Status();

        console.log('[Unassign Student] status:', status ? 'success' : 'failed');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: await window.bcnI18n.getPhrase('sc_sa'),
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('err_student_una'),
        });

        document.body.appendChild(statusMessageEl);
    }
}

export default GLPBox;
