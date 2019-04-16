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
            span(await window.beaconingAPI.getPhrase('lm_create_plan')),
        );
    }
}

export default CreatePlanButton;
