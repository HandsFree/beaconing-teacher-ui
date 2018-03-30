// @flow
import { span, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class CreatePlanButton extends Component {
    async render() {
        return a(
            '.outline-button',
            {
                href: '#new_plan',
            },
            span('Create Plan'),
        );
    }
}

export default CreatePlanButton;
