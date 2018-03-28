// @flow
import Identicon from 'identicon.js';

import { aside, figure, img, figcaption, div, a, nav, i, span } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

class StudentAside extends Component {
    editMode: boolean = false;
    updateHooks = {
        StudentNameUpdate: this.updateName,
        EditDoneClicked: this.toggleEditButton,
        AssignedGLPsClicked: this.resetEditButton,
        AnalyticsClicked: this.resetEditButton,
    };

    async updateName() {
        const student = await window.beaconingAPI.getStudent(this.props.id);

        if (student) {
            this.state.student = student;

            this.state.studentName = `${student.profile.firstName} ${student.profile.lastName}`;

            const studentNameEl = document.getElementById('student-name');

            studentNameEl.textContent = student.studentName;
        }
    }

    toggleEditButton() {
        const button = document.getElementById('student-edit-button');
        const icon = button.getElementsByTagName('i')[0];

        if (icon.classList.contains('icon-pencil')) {
            icon.classList.remove('icon-pencil');
            icon.classList.add('icon-trash-empty');
            this.editMode = true;

            return;
        }

        icon.classList.remove('icon-trash-empty');
        icon.classList.add('icon-pencil');
        this.editMode = false;
    }

    resetEditButton() {
        const button = document.getElementById('student-edit-button');
        const icon = button.getElementsByTagName('i')[0];

        if (icon.classList.contains('icon-trash-empty')) {
            icon.classList.remove('icon-trash-empty');
            icon.classList.add('icon-pencil');
            this.editMode = false;
        }
    }

    async handleEditClick() {
        if (this.editMode === false) {
            this.toggleEditButton();
            this.emit('StudentEditClicked');

            return;
        }

        const status = await window.beaconingAPI.deleteStudent(this.state.student.id);
        const statusMessage = new Status();

        console.log('[Delete Student] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            this.emit('StudentDeleted');

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: 'student not deleted!',
        });

        this.appendView(statusMessageEl);
    }

    async init() {
        const student = await window.beaconingAPI.getStudent(this.props.id);

        if (student) {
            this.state.student = student;
            this.state.studentName = `${student.profile.firstName} ${student.profile.lastName}`;
        }
    }

    async render() {
        const {
            profile,
            identiconSha512,
        } = this.state.student;

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
            size: 160,
            format: 'svg',
        };

        const imgData = `data:image/svg+xml;base64,${new Identicon(identiconSha512, options).toString()}`;

        return aside(
            '#student-aside',
            nav(
                '#student-options',
                a(
                    '#student-edit-button',
                    {
                        title: 'Edit',
                        onclick: () => {
                            this.handleEditClick();
                        },
                    },
                    i('.icon-pencil'),
                ),
            ),
            div(
                '#student-info',
                figure(
                    img({
                        src: imgData,
                    }),
                    figcaption('#student-name', this.state.studentName),
                ),
            ),
            nav(
                '#student-nav',
                a(
                    '.item.active',
                    {
                        onclick: (event) => {
                            const { target } = event;

                            this.toggleActive(target);
                            this.emit('AssignedGLPsClicked');
                        },
                    },
                    span('Assigned GLPs'),
                ),
                a(
                    '.item',
                    {
                        onclick: (event) => {
                            const { target } = event;

                            this.toggleActive(target);
                            this.emit('AnalyticsClicked');
                        },
                    },
                    span('Analytics'),
                ),
            ),
        );
    }

    toggleActive(el: EventTarget) {
        const nav = document.getElementById('student-nav');
        const active = nav.querySelector('.active');

        active.classList.remove('active');

        if (el.classList.contains('item')) {
            el.classList.add('active');
            return;
        }

        el.parentElement.classList.add('active');
    }
}

export default StudentAside;
