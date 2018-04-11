// @flow

import { div, span, img, p, h3 } from '../../../../core/html';

import { Component } from '../../../../core/component';

class Panel extends Component {
    async render() {
        const {
            title,
            msg,
            data,
        } = this.props;

        // console.log(data);

        const studentsEl = [];

        for (const dataObj of data) {
            const {
                student,
                score,
            } = dataObj;

            const scoreNum = Math.floor(score * 100);

            // console.log(student.username, scoreNum);

            const colour = do {
                if (scoreNum < 50) {
                    '.status-red';
                } else if (scoreNum >= 50 && scoreNum < 75) {
                    '.status-amber';
                } else if (scoreNum >= 75) {
                    '.status-green';
                }
            };

            const progress = `${scoreNum}%`;

            studentsEl.push(div(
                '.student',
                div(
                    '.flex-container.tablet-hide',
                    div(
                        '.student-profile-image',
                        img(
                            '.profile-blue',
                            {
                                src: `//${window.location.host}/dist/beaconing/images/profile.png`,
                                alt: student?.username,
                            },
                        ),
                    ),
                ),
                div(
                    '.flex-container.flex-column.flex-spacearound.flex-grow',
                    div(
                        '.student-name',
                        p(student?.username),
                    ),
                    div(
                        '.student-percentage',
                        p(`${msg}:`),
                        div(
                            '.progress-bar',
                            div(
                                colour,
                                {
                                    style: {
                                        width: progress,
                                    },
                                },
                                span(progress),
                            ),
                        ),
                    ),
                ),
            ));
        }

        const studentsContainerEl = div('.students', studentsEl);

        return div(
            '.student-section',
            div(
                '.title',
                h3(title),
            ),
            studentsContainerEl,
        );
    }
}

export default Panel;
