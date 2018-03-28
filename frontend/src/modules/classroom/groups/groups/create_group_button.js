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
            span('Create Group'),
        );
    }
}

export default CreateGroupButton;
