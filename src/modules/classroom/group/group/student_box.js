// @flow
import Identicon from 'identicon.js';

import { i, div, figure, img, h4, a, h3 } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';
import nullishCheck from '../../../../core/util';

class StudentBox extends Component {
    async init() {
        this.state.trans = await window.beaconingAPI.getPhrases(
            'con_remove_student',
            'sc_sa',
            'err_student_una',
        );
    }

    async render() {
        const {
            studentID,
            username,
            firstName,
            lastName,
            identiconSha512,
            usernameTrans,
        } = this.props;

        const studentName = do {
            if (firstName && lastName) {
                div(
                    '.flex-column',
                    h3('.name', `${firstName} ${lastName}`),
                    h4(
                        '.username',
                        {
                            title: usernameTrans,
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

        let studentColour = randArray();

        // fix this complexity
        if (window.sessionStorage) {
            if (!window.sessionStorage.getItem('student_colours')) {
                const colours = {};

                colours[username] = studentColour;

                window.sessionStorage.setItem('student_colours', JSON.stringify(colours));
            } else {
                const colours = JSON.parse(window.sessionStorage.getItem('student_colours'));

                if (nullishCheck(colours[username], false)) {
                    studentColour = colours[username];
                } else {
                    colours[username] = studentColour;

                    window.sessionStorage.setItem('student_colours', JSON.stringify(colours));
                }
            }
        }

        const options = {
            foreground: studentColour,
            background: [245, 245, 245, 255],
            margin: 0.1,
            size: 64,
            format: 'svg',
        };

        const imgData = `data:image/svg+xml;base64,${new Identicon(identiconSha512, options).toString()}`;
        const card = div(
            '.student-box',

            figure(
                img({ src: imgData }),
            ),
            div(
                '.info.flex-column',
                div(
                    '.title',
                    studentName,
                ),
                div(
                    '.toolbar',
                    i('.icon-trash-empty'),
                ),
            ),
        );

        return a(
            {
                href: `//${window.location.host}/classroom/student?id=${studentID}`,
            },
            card,
        );
    }

    async removeStudent() {
        const removeStudentTransl = this.state.trans.get('con_remove_student');
        if (!confirm(removeStudentTransl)) {
            return;
        }

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
                message: this.state.trans.get('sc_sa'),
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: this.state.trans.get('err_student_una'),
        });

        document.body.appendChild(statusMessageEl);
    }
}

export default StudentBox;
