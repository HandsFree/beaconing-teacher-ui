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
            span(await window.bcnI18n.getPhrase('cr_create_student')),
        );
    }
}

export default CreateStudentButton;
