// @flow
import { section, div, a, i, h1, form, input, select, option, p, label, span } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';
import nullishCheck from '../../../../core/util';

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
        this.state.teacherGender = nullishCheck(currUser.teacherSettings?.gender, 'male');
    }

    async editTeacher(editButton: EventTarget) {
        const obj = {
            email: this.state.teacherEmail,
            language: nullishCheck(this.state.teacherLang, this.state.teacher?.language),
            teacherSettings: {
                firstName: nullishCheck(this.state.teacherFirstName, this.state.teacher?.teacherSettings?.firstName),
                lastName: nullishCheck(this.state.teacherLastName, this.state.teacher?.teacherSettings?.lastName),
                gender: this.state.teacherGender,
                school: nullishCheck(this.state.teacherSchool, this.state.teacher?.teacherSettings?.school),
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
                message: await window.bcnI18n.getPhrase('teacher_edited'),
            });

            this.appendView(statusMessageEl);

            editButton.textContent = await window.bcnI18n.getPhrase('update');

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('teacher_ne'),
        });

        editButton.textContent = await window.bcnI18n.getPhrase('update');

        this.appendView(statusMessageEl);
    }

    async render() {
        const { teacher } = this.state;

        const updatingText = await window.bcnI18n.getPhrase('updating');

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
                        await window.bcnI18n.getPhrase('go_back'),
                    ),
                    h1(await window.bcnI18n.getPhrase('pf_editing_profile')),
                    div('.empty-spacer', ' '),
                ),
            ),
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p(await window.bcnI18n.getPhrase('pf_teacher_info')),
                    ),
                    form(
                        '.edit-teacher',
                        label(
                            span(await window.bcnI18n.getPhrase('pf_teacher_fn')),
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
                            span(await window.bcnI18n.getPhrase('pf_teacher_ln')),
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
                            span(await window.bcnI18n.getPhrase('pf_teacher_gender')),
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
                                        value: 'female',
                                        selected: teacher.teacherSettings?.gender === 'female',
                                    },
                                    await window.bcnI18n.getPhrase('female'),
                                ),
                                option(
                                    {
                                        value: 'male',
                                        selected: teacher.teacherSettings?.gender === 'male',
                                    },
                                    await window.bcnI18n.getPhrase('male'),
                                ),
                                option(
                                    {
                                        value: 'other',
                                        selected: teacher.teacherSettings?.gender === 'other',
                                    },
                                    await window.bcnI18n.getPhrase('other'),
                                ),
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('pf_teacher_school')),
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
                            span(await window.bcnI18n.getPhrase('pf_teacher_email')),
                            input(
                                '#teacher-email.text-field',
                                {
                                    type: 'email',
                                    placeholder: await window.bcnI18n.getPhrase('pf_enter_new_email'),
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.teacherEmail = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            '.select',
                            span(await window.bcnI18n.getPhrase('pf_teacher_language')),
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
                                    'Deutsch',
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

                                        target.textContent = `${updatingText}...`;
                                    },
                                },
                                await window.bcnI18n.getPhrase('update'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default ProfileEditForm;
