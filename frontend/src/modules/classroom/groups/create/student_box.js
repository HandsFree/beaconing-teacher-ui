// @flow
import { div, h4, input } from '../../../../core/html';

import { Component } from '../../../../core/component';

class StudentBox extends Component {
    async render() {
        const {
            id,
            username,
            profile,
        } = this.props;

        const name = do {
            if (profile.firstName && profile.lastName) {
                `${profile.firstName} ${profile.lastName}`;
            } else {
                username;
            }
        };

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
