// @flow
import { div, h4, a } from '../../../core/html';

import { Component } from '../../../core/component';
import Status from '../../status';

class GroupBox extends Component {
    async render() {
        const { group } = this.props;

        return div(
            '.small-box',
            div(
                '.title',
                h4('.name', group.name),
            ),
            a(
                {
                    onclick: (event) => {
                        const { target } = event;
                        this.assignGroup(target);
                    },
                },
                'Assign',
            ),
        );
    }

    async assignGroup(assignButton: HTMLElement) {
        const {
            glpID,
            group,
        } = this.props;

        assignButton.textContent = 'Assigning...';

        const status = await window.beaconingAPI.assignGroup(group.id, glpID);
        const statusMessage = new Status();

        console.log('[Assign Group] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: 'group assigned!',
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: 'group not assigned!',
        });

        assignButton.textContent = 'Assign';

        document.body.appendChild(statusMessageEl);
    }
}

export default GroupBox;