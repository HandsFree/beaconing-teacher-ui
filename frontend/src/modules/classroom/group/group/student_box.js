// @flow
import Identicon from 'identicon.js';

import { div, figure, img, h4, a } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

class StudentBox extends Component {
    async render() {
        const {
            studentID,
            firstName,
            lastName,
            identiconSha512,
        } = this.props;

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
                    h4('.name', `${firstName} ${lastName}`),
                ),
                div(
                    a(
                        {
                            href: `//${window.location.host}/classroom/student?id=${studentID}`,
                        },
                        'View Student',
                    ),
                    a(
                        {
                            onclick: () => {
                                this.removeStudent();
                            },
                        },
                        'Remove',
                    ),
                ),
            ),
        );
    }

    async removeStudent() {
        const {
            groupID,
            studentID,
        } = this.props;

        const status = await window.beaconingAPI.unassignStudentFromGroup(studentID, groupID);
        const statusMessage = new Status();

        console.log('[Unassign Student] status:', status ? 'success' : 'failed');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: 'Unassigned!',
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: 'student not unassigned!',
        });

        document.body.appendChild(statusMessageEl);
    }
}

export default StudentBox;
