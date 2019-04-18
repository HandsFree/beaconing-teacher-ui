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
            fromGroupID,
            fromGroupName,
        } = this.props;

        const fromGroupEl = h4(
            '.group',
            'From group: ',
            a(
                '.link-underline',
                {
                    href: `//${window.location.host}/classroom/group?id=${fromGroupID}`,
                },
                fromGroupName,
            ),
        );

        const unassignEl = a(
            '.item',
            {
                onclick: () => {
                    this.unassignPlan();
                },
            },
            await window.beaconingAPI.getPhrase('cr_unassign'),
        );

        return div(
            '.small-box.flex-4.flex-column',
            div(
                '.title',
                div(
                    '.flex-column',
                    h3('.name', name),
                    fromGroupName ? fromGroupEl : [],
                ),
            ),
            div(
                '.content.margin-top-20',
                div(
                    '.toolbar',
                    a(
                        '.item',
                        {
                            href: `//${window.location.host}/lesson_manager#view?id=${glpID}`,
                        },
                        await window.beaconingAPI.getPhrase('view'),
                    ),
                    !fromGroupID ? unassignEl : [],
                ),
            ),
        );
    }

    async unassignPlan() {
        const {
            linkId,
            studentID,
            fromGroupID,
        } = this.props;

        if (fromGroupID) {
            return;
        }

        const unassignGLPTransl = await window.beaconingAPI.getPhrase('con_unassign_glp');
        if (!confirm(unassignGLPTransl)) {
            return;
        }

        const status = await window.beaconingAPI.unassignStudent(studentID, linkId);
        const statusMessage = new Status();

        console.log('[Unassign Student] status:', status ? 'success' : 'failed');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: await window.beaconingAPI.getPhrase('sc_sa'),
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.beaconingAPI.getPhrase('err_student_una'),
        });

        document.body.appendChild(statusMessageEl);
    }
}

export default GLPBox;
