// @flow
import { div, figure, img, h4, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class StudentBox extends Component {
    async render() {
        const {
            id,
            username,
        } = this.props;

        return div(
            '.student-box',
            figure(img({
                src: `//${window.location.host}/dist/beaconing/images/student.jpg`,
            })),
            div(
                '.info.flex-column',
                div(
                    '.title',
                    h4(username),
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
