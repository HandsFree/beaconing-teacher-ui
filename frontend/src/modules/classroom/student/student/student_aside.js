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

    state = {
        studentName: '',
    };

    async updateName() {
        const student = await window.beaconingAPI.getStudent(this.props.id);

        if (student) {
            this.state.student = student;

            this.state.studentName = do {
                if (student.profile.firstName && student.profile.lastName) {
                    div(
                        '#student-name.flex-column',
                        span('.name', `${student.profile.firstName} ${student.profile.lastName}`),
                        span(
                            '.username',
                            {
                                title: await window.bcnI18n.getPhrase('username'),
                            },
                            student.username,
                        ),
                    );
                } else {
                    span('#student-name.name', student.username);
                }
            };

            const studentNameEl = document.getElementById('student-name');

            studentNameEl.parentElement.replaceChild(this.state.studentName, studentNameEl);
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

        const delStudentTranslation = await window.bcnI18n.getPhrase('con_delete_student');
        if (!confirm(delStudentTranslation)) {
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
            message: await window.bcnI18n.getPhrase('err_student_nd'),
        });

        this.appendView(statusMessageEl);
    }

    async init() {
        const student = await window.beaconingAPI.getStudent(this.props.id);

        if (student) {
            this.state.student = student;
            this.state.studentName = do {
                if (student.profile.firstName && student.profile.lastName) {
                    div(
                        '#student-name.flex-column',
                        span('.name', `${student.profile.firstName} ${student.profile.lastName}`),
                        span(
                            '.username',
                            {
                                title: await window.bcnI18n.getPhrase('username'),
                            },
                            student.username,
                        ),
                    );
                } else {
                    span('#student-name.name', student.username);
                }
            };
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
                        title: await window.bcnI18n.getPhrase('edit'),
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
                    figcaption(this.state.studentName),
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
                    span(await window.bcnI18n.getPhrase('cr_assigned_glps')),
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
                    span(await window.bcnI18n.getPhrase('analytics')),
                ),
            ),
        );
    }

    toggleActive(el: EventTarget) {
        const studentNav = document.getElementById('student-nav');
        const active = studentNav.querySelector('.active');

        active.classList.remove('active');

        if (el.classList.contains('item')) {
            el.classList.add('active');
            return;
        }

        el.parentElement.classList.add('active');
    }
}

export default StudentAside;
