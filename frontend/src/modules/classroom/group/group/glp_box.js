// @flow
import { div, a, h3 } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

class GLPBox extends Component {
    async render() {
        const {
            name,
            glpID,
            dashboardLink,
        } = this.props;

        const dashboardEl = do {
            if (dashboardLink) {
                a(
                    '.item',
                    {
                        href: dashboardLink,
                        target: '_blank',
                    },
                    await window.bcnI18n.getPhrase('analytics'),
                );
            }
        };

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
                        href: `//${window.location.host}/lesson_manager#view?id=${glpID}&prev=classroom/groups`,
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
                dashboardEl,
            ),
        );
    }

    async unassignPlan() {
        const {
            assignedGLPID,
            groupID,
        } = this.props;

        const status = await window.beaconingAPI.unassignGroup(groupID, assignedGLPID);
        const statusMessage = new Status();

        console.log('[Unassign Group] status:', status ? 'success' : 'failed');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: await window.bcnI18n.getPhrase('sa'),
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('group_una'),
        });

        document.body.appendChild(statusMessageEl);
    }
}

export default GLPBox;
