// @flow

import { div, span, img, p, h3, a } from '../../../../core/html';

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
                id,
                username,
                score,
            } = dataObj;

            const scoreNum = Math.floor(score * 100);

            // console.log(dataObj);

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

            const progressEl = do {
                if (score <= 0) {
                    div(
                        '.progress-bar',
                        await window.bcnI18n.getPhrase('err_no_data'),
                    );
                } else {
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
                    );
                }
            };

            studentsEl.push(div(
                '.student',
                div(
                    '.flex-container.flex-column.flex-spacearound.flex-grow',
                    div(
                        '.student-name',
                        a(
                            {
                                href: `//${window.location.host}/classroom/student?id=${id}`,
                            },
                            username,
                        ),
                    ),
                    div(
                        '.student-percentage',
                        p(`${msg}:`),
                        progressEl,
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
