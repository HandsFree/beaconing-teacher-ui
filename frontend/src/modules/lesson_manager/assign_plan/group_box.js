// @flow
import { p, div, h3, a } from '../../../core/html';

import { Component } from '../../../core/component';
import Status from '../../status';

class GroupBox extends Component {
    async render() {
        const { group } = this.props;

        const card = div(
            '.small-box',
            div(
                '.title',
                h3('.name', group.name),
            ),
            p('.assign-status'),
        );
        return a(
            '.fake-link',
            {
                onclick: (event) => {
                    const { target } = event;
                    this.assignGroup(target);
                },
            },
            card,
        );
    }

    async assignGroup(assignButton: HTMLElement) {
        const assignGroupTransl = await window.bcnI18n.getPhrase('con_assign_group');
        if (!confirm(assignGroupTransl)) {
            return;
        }

        const {
            glpID,
            group,
        } = this.props;

        const assignMsg = `${await window.bcnI18n.getPhrase('lm_assigning')}...`;
        const statusInfo = assignButton.querySelector('.title');
        if (statusInfo) {
            statusInfo.innerText = assignMsg;
        }

        const status = await window.beaconingAPI.assignGroup(group.id, glpID);
        console.log('assigning ', group.id, ' aka ', group, ' to ', glpID);

        const statusMessage = new Status();

        console.log('[Assign Group] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: await window.bcnI18n.getPhrase('sc_group_asg'),
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('err_group_na'),
        });

        if (statusInfo) {
            const assignPhrase = await window.bcnI18n.getPhrase('lm_assign');
            statusInfo.innerText = assignPhrase;
        }

        document.body.appendChild(statusMessageEl);
    }
}

export default GroupBox;
