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
        teacherGender: null,
        teacherSchool: null,
        teacherLang: null,
    };

    async init() {
        const currUser = await window.beaconingAPI.getCurrentUser();

        this.state.teacher = currUser;
        this.state.teacherGender = currUser.teacherSettings?.gender ?? 'male';
    }

    async editTeacher(editButton: EventTarget) {
        const obj = {
            email: this.state.teacherEmail,
            language: this.state.teacherLang ?? this.state.teacher.language,
            teacherSettings: {
                firstName: this.state.teacherFirstName ?? this.state.teacher.teacherSettings.firstName,
                lastName: this.state.teacherLastName ?? this.state.teacher.teacherSettings.lastName,
                gender: this.state.teacherGender,
                school: this.state.teacherSchool ?? this.state.teacher.teacherSettings.school,
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
                            '.select',
                            span('Teacher Gender'),
                            select(
                                '#teacher-gender',
                                {
                                    onchange: (event) => {
                                        const { target } = event;

                                        this.state.teacherGender = target.value;
                                    },
                                },
                                option(
                                    {
                                        value: 'male',
                                        selected: teacher.teacherSettings?.gender === 'male',
                                    },
                                    'Male',
                                ),
                                option(
                                    {
                                        value: 'female',
                                        selected: teacher.teacherSettings?.gender === 'female',
                                    },
                                    'Female',
                                ),
                                option(
                                    {
                                        value: 'other',
                                        selected: teacher.teacherSettings?.gender === 'other',
                                    },
                                    'Other',
                                ),
                            ),
                        ),
                        label(
                            span('Teacher School'),
                            input(
                                '#teacher-school.text-field',
                                {
                                    type: 'text',
                                    value: teacher.teacherSettings?.school,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.teacherSchool = target.value;
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
                        label(
                            '.select',
                            span('Teacher Language'),
                            select(
                                '#teacher-language',
                                {
                                    onchange: (event) => {
                                        const { target } = event;

                                        this.state.teacherLang = target.value;
                                    },
                                },
                                option(
                                    {
                                        value: 'en-GB',
                                        selected: teacher.language === 'en-GB',
                                    },
                                    'English',
                                ),
                                option(
                                    {
                                        value: 'fr-FR',
                                        selected: teacher.language === 'fr_FR',
                                    },
                                    'Français',
                                ),
                                option(
                                    {
                                        value: 'es-ES',
                                        selected: teacher.language === 'es-ES',
                                    },
                                    'Español',
                                ),
                                option(
                                    {
                                        value: 'it-IT',
                                        selected: teacher.language === 'it-IT',
                                    },
                                    'Italiano',
                                ),
                                option(
                                    {
                                        value: 'de-DE',
                                        selected: teacher.language === 'de-DE',
                                    },
                                    'Deutsche',
                                ),
                                option(
                                    {
                                        value: 'ro-RO',
                                        selected: teacher.language === 'ro-RO',
                                    },
                                    'Română',
                                ),
                                option(
                                    {
                                        value: 'pl-PL',
                                        selected: teacher.language === 'pl-PL',
                                    },
                                    'Polskie',
                                ),
                                option(
                                    {
                                        value: 'tr-TR',
                                        selected: teacher.language === 'tr-TR',
                                    },
                                    'Türk',
                                ),
                                option(
                                    {
                                        value: 'pt-PT',
                                        selected: teacher.language === 'pt-PT',
                                    },
                                    'Português',
                                ),
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
