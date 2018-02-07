// @flow
import { div, figure, img, h4, a, span } from '../../../core/html';

import { Component } from '../../../core/component';

class StudentBox extends Component {
    async init() {
        if (!this.props.student) {
            throw new Error(`[${this.constructor.name}] Student not given!`);
        }
    }
    async assign() {
        const {
            id,
            student,
        } = this.props;

        const status = await window.beaconingAPI.assignStudent(student.id, id);

        if (status) {
            const element = div(
                '.student-box',
                figure(img({
                    src: `//${window.location.host}/dist/beaconing/images/student.jpg`,
                })),
                div(
                    '.info.flex-column',
                    div(
                        '.title',
                        h4('.name', student.username),
                    ),
                    a(
                        {
                            onclick: this.assign,
                        },
                        'Assign',
                    ),
                    span('.tick', '✔'),
                ),
            );

            this.updateView(element);
        }
    }

    async render() {
        const { student } = this.props;

        return div(
            '.student-box',
            figure(img({
                src: `//${window.location.host}/dist/beaconing/images/student.jpg`,
            })),
            div(
                '.info.flex-column',
                div(
                    '.title',
                    h4('.name', student.username),
                ),
                a(
                    {
                        onclick: this.assign.bind(this),
                    },
                    'Assign',
                ),
            ),
        );
    }
}

export default StudentBox;
