// @flow
import { div, h4, input } from '../../../../core/html';

import { Component } from '../../../../core/component';

class StudentBox extends Component {
    async render() {
        const {
            id,
            profile,
            checked,
        } = this.props;

        console.log(checked);

        const name = `${profile.firstName} ${profile.lastName}`;

        return div(
            '.small-box',
            div(
                '.title',
                h4('.name', name),
            ),
            input(
                '.checkbox',
                {
                    type: 'checkbox',
                    value: id,
                    onchange: () => {
                        this.emit('StudentSelected');
                    },
                    checked,
                },
            ),
        );
    }
}

export default StudentBox;
