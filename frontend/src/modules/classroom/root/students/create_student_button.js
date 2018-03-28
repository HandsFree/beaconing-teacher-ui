// @flow
import { span, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class CreateStudentButton extends Component {
    async render() {
        return a(
            '.outline-button',
            {
                href: '#create',
            },
            span('Create Student'),
        );
    }
}

export default CreateStudentButton;
