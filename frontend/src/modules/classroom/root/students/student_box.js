// @flow
import Identicon from 'identicon.js';

import { div, figure, img, h4, a, h3 } from '../../../../core/html';

import { Component } from '../../../../core/component';

class StudentBox extends Component {
    async render() {
        const {
            id,
            username,
            firstName,
            lastName,
            identiconSha512,
        } = this.props;

        const studentName = do {
            if (firstName && lastName) {
                div(
                    '.flex-column',
                    h3('.name', `${firstName} ${lastName}`),
                    h4(
                        '.username',
                        {
                            title: await window.bcnI18n.getPhrase('username'),
                        },
                        username,
                    ),
                );
            } else {
                h3('.name', username);
            }
        };

        const randArray = () => {
            const arr = [];

            for (let i = 0; i < 3; i++) {
                const num = (Math.random() * 225) + 1;
                arr.push(num);
            }

            arr.push(225);

            return arr;
        };

        const options = {
            foreground: randArray(),
            background: [255, 255, 255, 255],
            margin: 0.1,
            size: 64,
            format: 'svg',
        };

        const imgData = `data:image/svg+xml;base64,${new Identicon(identiconSha512, options).toString()}`;

        return div(
            '.student-box',
            figure(img({
                src: imgData,
            })),
            div(
                '.info.flex-column',
                div(
                    '.title',
                    studentName,
                ),
                a(
                    {
                        href: `//${window.location.host}/classroom/student?id=${id}`,
                    },
                    await window.bcnI18n.getPhrase('cr_view_student'),
                ),
            ),
        );
    }
}

export default StudentBox;
