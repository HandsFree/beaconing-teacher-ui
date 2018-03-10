// @flow
import { div, figure, img, h4, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

var Identicon = require('identicon.js');

class StudentBox extends Component {
    async render() {
        const {
            id,
            username,
        } = this.props;

        const data = "";

        return div(
            '.student-box',
            figure(img({
                src: `data:image/png;base64,${data}`,
            })),
            div(
                '.info.flex-column',
                div(
                    '.title',
                    h4('.name', username),
                ),
                a(
                    {
                        href: `./classroom/student?id=${id}`,
                    },
                    'View Student',
                ),
            ),
        );
    }
}

export default StudentBox;
