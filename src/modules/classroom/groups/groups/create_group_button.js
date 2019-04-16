// @flow
import { span, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class CreateGroupButton extends Component {
    async render() {
        return a(
            '.outline-button',
            {
                href: '#create',
            },
            span(await window.beaconingAPI.getPhrase('cr_create_group')),
        );
    }
}

export default CreateGroupButton;
