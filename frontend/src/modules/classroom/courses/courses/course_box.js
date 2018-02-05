// @flow
import { div, h4, a } from '../../../../core/html';

import { Component } from '../../../../core/component';

class CourseBox extends Component {
    async render() {
        const { name } = this.props;

        return div(
            '.class-box',
            div(
                '.title',
                h4('.name', name),
            ),
            a('View'),
        );
    }
}

export default CourseBox;
