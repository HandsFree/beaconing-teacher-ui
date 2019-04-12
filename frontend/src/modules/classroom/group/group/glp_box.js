// @flow
import { div, a, h3 } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

const translationKeys = [
    'view', 'analytics', 'cr_unassign', 'con_unassign_glp',
    'sc_sa', 'err_group_una',
];

class GLPBox extends Component {
    async init() {
        this.state = {
            trans: await window.beaconingAPI.getPhrases(...translationKeys),
        };
    }

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
                '.content',
                div(
                    '.toolbar',
                    a(
                        '.item',
                        {
                            href: `//${window.location.host}/lesson_manager#view?id=${glpID}`,
                        },
                        this.state.trans.get('view'),
                    ),
                    a(
                        '.item',
                        {
                            href: `//${window.location.host}/classroom/group#analytics?id=${glpID}`,
                        },
                        this.state.trans.get('analytics'),
                    ),
                    a(
                        '.item',
                        {
                            onclick: () => {
                                this.unassignPlan();
                            },
                        },
                        this.state.trans.get('cr_unassign'),
                    ),
                ),
            ),
        );
    }

    async unassignPlan() {
        const unassignGLPTransl = this.state.trans.get('con_unassign_glp');
        if (!confirm(unassignGLPTransl)) {
            return;
        }

        const {
            linkId,
            groupID,
        } = this.props;

        const status = await window.beaconingAPI.unassignGroup(groupID, linkId);
        const statusMessage = new Status();

        console.log('[Unassign Group] status:', status ? 'success' : 'failed');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: this.state.trans.get('sc_sa'),
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: this.state.trans.get('err_group_una'),
        });

        document.body.appendChild(statusMessageEl);
    }
}

export default GLPBox;
