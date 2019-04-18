// @flow
import { div, h4, input, h3 } from '../../../../core/html';

import { Component } from '../../../../core/component';

class StudentBox extends Component {    
    async render() {
        const {
            id,
            username,
            profile,
            checked,
            usernameTrans,
        } = this.props;

        console.log(checked);

        const studentName = do {
            if (profile.firstName && profile.lastName) {
                div(
                    '.flex-column',
                    h3('.name', `${profile.firstName} ${profile.lastName}`),
                    h4(
                        '.username',
                        {
                            title: usernameTrans,
                        },
                        username,
                    ),
                );
            } else {
                h3('.name', username);
            }
        };

        return div(
            '.small-box',
            div(
                '.title',
                studentName,
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
