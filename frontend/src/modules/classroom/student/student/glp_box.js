// @flow
import { div, a, h3 } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

class GLPBox extends Component {
    async render() {
        const {
            name,
            glpID,
        } = this.props;

        return div(
            '.glp-assigned-box.flex-4.flex-column',
            div(
                '.title',
                div(
                    '.flex-column',
                    h3('.name', name),
                ),
            ),
            div(
                '.toolbar',
                a(
                    '.item',
                    {
                        href: `//${window.location.host}/lesson_manager#view?id=${glpID}&prev=classroom`,
                    },
                    'View',
                ),
                a(
                    '.item',
                    {
                        onclick: () => {
                            this.unassignPlan();
                        },
                    },
                    'Unassign',
                ),
            ),
        );
    }

    async unassignPlan() {
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
                message: 'Unassigned!',
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: 'student not unassigned!',
        });

        document.body.appendChild(statusMessageEl);
    }
}

export default GLPBox;
