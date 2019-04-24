// @flow
import { div, h4, h3, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class GroupBox extends Component {
    async render() {
        const {
            id,
            name,
            studentCount,
        } = this.props;

        const studentCountEl = h4('.student-count', 
        studentCount !== 0 
                ? `${studentCount} students`
                : `No students`);

        const card = div(
            '.small-box',
            div(
                '.title.flex-column',
                h3('.name', name),
                studentCountEl,
            ),
            div(
                '.box-buttons',
            ),
        );

        return a(
            {
                href: `//${window.location.host}/classroom/group?id=${id}`,
            },
            card,
        );
    }
}

export default GroupBox;
