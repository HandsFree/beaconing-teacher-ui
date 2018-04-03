// @flow
import { section, div, a, i, h1, form, input, select, option, p, label, span, small, textarea } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

class ProfileEditForm extends Component {
    state = {
        teacher: {},
        teacherFirstName: null,
        teacherLastName: null,
        teacherEmail: null,
    };

    async init() {
        const currUser = await window.beaconingAPI.getCurrentUser();

        this.state.teacher = currUser;
    }

    async editTeacher(editButton: EventTarget) {
        const obj = {
            email: this.state.teacherEmail,
            teacherSettings: {
                firstName: this.state.teacherFirstName ?? this.state.teacher.teacherSettings.firstName,
                lastName: this.state.teacherLastName ?? this.state.teacher.teacherSettings.lastName,
            },
        };

        // console.log(obj);

        const status = await window.beaconingAPI.editUser(obj);
        const statusMessage = new Status();

        console.log('[Edit Teacher] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: `teacher edited!`,
            });

            this.appendView(statusMessageEl);

            editButton.textContent = 'Update';

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: 'teacher not edited!',
        });

        planButton.textContent = 'Update';

        this.appendView(statusMessageEl);
    }

    async render() {
        const { teacher } = this.state;

        return div(
            '.flex-column',
            section(
                '.flex-column',
                div(
                    '#section-header',
                    a(
                        '.back',
                        {
                            href: `//${window.location.host}/profile`,
                        },
                        i('.icon-angle-left'),
                        'Go Back',
                    ),
                    h1('Editing Profile'),
                    div('.empty-spacer', ' '),
                ),
            ),
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p('Enter New Teacher Information:'),
                    ),
                    form(
                        '.edit-teacher',
                        label(
                            span('Teacher First Name'),
                            input(
                                '#teacher-first-name.text-field',
                                {
                                    type: 'text',
                                    value: teacher.teacherSettings?.firstName,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.teacherFirstName = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Teacher Last Name'),
                            input(
                                '#teacher-last-name.text-field',
                                {
                                    type: 'text',
                                    value: teacher.teacherSettings?.lastName,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.teacherLastName = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Teacher Email'),
                            input(
                                '#teacher-email.text-field',
                                {
                                    type: 'email',
                                    placeholder: 'Enter New Email (or leave blank)',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.teacherEmail = target.value;
                                    },
                                },
                            ),
                        ),
                        div(
                            '.flex-justify-end.margin-top-10',
                            div(
                                '#edit-teacher-button.button-action',
                                {
                                    onclick: (event) => {
                                        const { target } = event;
                                        this.editTeacher(target);

                                        target.textContent = 'Updating...';
                                    },
                                },
                                'Update',
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default ProfileEditForm;
