// @flow
import Identicon from 'identicon.js';

import { div, figure, img, h4, a } from '../../../../core/html';

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
                `${firstName} ${lastName}`;
            } else {
                username;
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
                    h4('.name', studentName),
                ),
                a(
                    {
                        href: `//${window.location.host}/classroom/student?id=${id}`,
                    },
                    'View Student',
                ),
            ),
        );
    }
}

export default StudentBox;
