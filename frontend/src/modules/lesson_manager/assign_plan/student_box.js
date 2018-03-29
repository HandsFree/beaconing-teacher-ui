// @flow
import Identicon from 'identicon.js';

import { div, figure, img, h4, a, span } from '../../../core/html';

import { Component } from '../../../core/component';
import Status from '../../status';

class StudentBox extends Component {
    state = {
        imgData: '',
        assignedStudents: [],
    };

    async init() {
        if (!this.props.student) {
            throw new Error(`[${this.constructor.name}] Student not given!`);
        }

        const { student } = this.props;

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

        this.state.imgData = `data:image/svg+xml;base64,${new Identicon(student.identiconSha512, options).toString()}`;
    }

    async assign(assignButton: HTMLElement) {
        const {
            glpID,
            student,
        } = this.props;

        assignButton.textContent = 'Assigning...';

        const status = await window.beaconingAPI.assignStudent(student.id, glpID);
        const statusMessage = new Status();

        console.log('[Assign Student] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: 'student assigned!',
            });

            document.body.appendChild(statusMessageEl);

            this.removeSelf();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: 'student not assigned!',
        });

        assignButton.textContent = 'Assign';

        document.body.appendChild(statusMessageEl);
    }

    async render() {
        const { student } = this.props;

        const name = `${student.profile.firstName} ${student.profile.lastName}`;

        return div(
            '.student-box',
            figure(img({
                src: this.state.imgData,
            })),
            div(
                '.info.flex-column',
                div(
                    '.title',
                    h4('.name', name),
                ),
                a(
                    {
                        onclick: (event) => {
                            const { target } = event;
                            this.assign(target);
                        },
                    },
                    'Assign',
                ),
            ),
        );
    }
}

export default StudentBox;
