// @flow
import { div, h4, input } from '../../../../core/html';

import { Component } from '../../../../core/component';

class StudentBox extends Component {
    async render() {
        const {
            id,
            profile,
        } = this.props;

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
                },
            ),
        );
    }
}

export default StudentBox;
