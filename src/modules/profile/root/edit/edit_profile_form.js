// @flow
import {
    section,
    div,
    a,
    i,
    h1,
    form,
    input,
    select,
    option,
    label,
    span,
} from '../../../../core/html';

import Form from '../../../form';
import Status from '../../../status';

class ProfileEditForm extends Form {
    state = {
        teacherFirstName: '',
        teacherLastName: '',
        teacherEmail: '',
        teacherGender: '',
        teacherSchool: '',
        teacherLang: '',
    };

    stateProxy = {
        set(obj, prop, value) {
            let trimmedValue = value;

            if (typeof value === 'string') {
                trimmedValue = value.trim();
            }

            // console.log(trimmedValue);

            return Reflect.set(obj, prop, trimmedValue);
        },
    };

    state = new Proxy(this.stateObj, this.stateProxy);

    teacher = {};

    async init() {
        const currUser = await window.beaconingAPI.getCurrentUser();

        this.teacher = currUser;
        this.state = {
            teacherFirstName: currUser.teacherSettings?.firstName ?? '',
            teacherLastName: currUser.teacherSettings?.lastName ?? '',
            teacherEmail: currUser.email ?? '',
            teacherGender: currUser.teacherSettings?.gender ?? 'female',
            teacherSchool: currUser.teacherSettings?.school ?? '',
            teacherLang: currUser.language ?? 'en-GB',
        };
    }

    async resetSubmit() {
        const updateButton = document.getElementById('edit-teacher-button');
        updateButton.textContent = await window.beaconingAPI.getPhrase('update');
    }

    async checkFields() {
        let success = true;
        const emptyMsg = await window.beaconingAPI.getPhrase('err_required_empty');

        if (this.state.teacherFirstName === '') {
            this.addError('teacher-fn-status', emptyMsg);
            success = false;
        }

        if (this.state.teacherLastName === '') {
            this.addError('teacher-ln-status', emptyMsg);
            success = false;
        }

        if (!success) {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Error',
                type: 'error',
                message: await window.beaconingAPI.getPhrase('err_form'),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        return true;
    }

    async editTeacher() {
        if (await this.checkFields() === false) {
            return;
        }

        const obj = {
            email: this.state.teacherEmail,
            language: this.state.teacherLang,
            teacherSettings: {
                firstName: this.state.teacherFirstName,
                lastName: this.state.teacherLastName,
                gender: this.state.teacherGender,
                school: this.state.teacherSchool,
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
                message: await window.beaconingAPI.getPhrase('teacher_edited'),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.beaconingAPI.getPhrase('err_teacher_ne'),
        });

        this.resetSubmit();

        this.appendView(statusMessageEl);
    }

    async render() {
        const updatingText = await window.beaconingAPI.getPhrase('updating');

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
                        await window.beaconingAPI.getPhrase('go_back'),
                    ),
                    h1(await window.beaconingAPI.getPhrase('pf_editing_profile')),
                    div('.empty-spacer', ' '),
                ),
            ),
            section(
                '.flex-column',
                div(
                    '.flex-column',
                    form(
                        '.edit-teacher',
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.beaconingAPI.getPhrase('pf_teacher_fn'))),
                                div('.desc-area', await window.beaconingAPI.getPhrase('pf_teacher_fn_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#teacher-first-name.text-field',
                                            {
                                                type: 'text',
                                                placeholder: await window.beaconingAPI.getPhrase('pf_teacher_fn_enter'),
                                                value: this.state.teacherFirstName,
                                                oninput: (event) => {
                                                    const { target } = event;
                        
                                                    this.state.teacherFirstName = target.value;
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#teacher-fn-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.beaconingAPI.getPhrase('pf_teacher_ln'))),
                                div('.desc-area', await window.beaconingAPI.getPhrase('pf_teacher_ln_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#teacher-last-name.text-field',
                                            {
                                                type: 'text',
                                                placeholder: await window.beaconingAPI.getPhrase('pf_teacher_ln_enter'),
                                                value: this.state.teacherLastName,
                                                oninput: (event) => {
                                                    const { target } = event;
                        
                                                    this.state.teacherLastName = target.value;
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#teacher-ln-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.beaconingAPI.getPhrase('pf_teacher_gender'))),
                                div('.desc-area', await window.beaconingAPI.getPhrase('pf_teacher_gender_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.select',
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
                                                    selected: this.state.teacherGender === 'female',
                                                },
                                                await window.beaconingAPI.getPhrase('female'),
                                            ),
                                            option(
                                                {
                                                    value: 'male',
                                                    selected: this.state.teacherGender === 'male',
                                                },
                                                await window.beaconingAPI.getPhrase('male'),
                                            ),
                                            option(
                                                {
                                                    value: 'other',
                                                    selected: this.state.teacherGender === 'other',
                                                },
                                                await window.beaconingAPI.getPhrase('other'),
                                            ),
                                            option(
                                                {
                                                    value: 'pnts',
                                                    selected: this.state.teacherGender === 'pnts',
                                                },
                                                await window.beaconingAPI.getPhrase('prefer_nts'),
                                            ),
                                        ),
                                    ),
                                ),
                                div('.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.beaconingAPI.getPhrase('pf_teacher_school'))),
                                div('.desc-area', await window.beaconingAPI.getPhrase('pf_teacher_school_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        input(
                                            '#teacher-school.text-field',
                                            {
                                                type: 'text',
                                                placeholder: await window.beaconingAPI.getPhrase('pf_teacher_school_enter'),
                                                value: this.state.teacherSchool,
                                                oninput: (event) => {
                                                    const { target } = event;
                        
                                                    this.state.teacherSchool = target.value;
                                                },
                                            },
                                        ),
                                    ),
                                ),
                                div('.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.beaconingAPI.getPhrase('pf_teacher_email'))),
                                div('.desc-area', await window.beaconingAPI.getPhrase('pf_teacher_email_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        input(
                                            '#teacher-email.text-field',
                                            {
                                                type: 'text',
                                                placeholder: await window.beaconingAPI.getPhrase('pf_teacher_email_enter'),
                                                value: this.state.teacherEmail,
                                                oninput: (event) => {
                                                    const { target } = event;
                        
                                                    this.state.teacherEmail = target.value;
                                                },
                                            },
                                        ),
                                    ),
                                ),
                                div('.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.beaconingAPI.getPhrase('pf_teacher_language'))),
                                div('.desc-area', await window.beaconingAPI.getPhrase('pf_teacher_language_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.select.required',
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
                                                    selected: this.state.teacherLang === 'en-GB',
                                                },
                                                'English',
                                            ),
                                            option(
                                                {
                                                    value: 'fr-FR',
                                                    selected: this.state.teacherLang === 'fr_FR',
                                                },
                                                'Français',
                                            ),
                                            option(
                                                {
                                                    value: 'es-ES',
                                                    selected: this.state.teacherLang === 'es-ES',
                                                },
                                                'Español',
                                            ),
                                            option(
                                                {
                                                    value: 'it-IT',
                                                    selected: this.state.teacherLang === 'it-IT',
                                                },
                                                'Italiano',
                                            ),
                                            option(
                                                {
                                                    value: 'de-DE',
                                                    selected: this.state.teacherLang === 'de-DE',
                                                },
                                                'Deutsch',
                                            ),
                                            option(
                                                {
                                                    value: 'ro-RO',
                                                    selected: this.state.teacherLang === 'ro-RO',
                                                },
                                                'Română',
                                            ),
                                            option(
                                                {
                                                    value: 'pl-PL',
                                                    selected: this.state.teacherLang === 'pl-PL',
                                                },
                                                'Polskie',
                                            ),
                                            option(
                                                {
                                                    value: 'tr-TR',
                                                    selected: this.state.teacherLang === 'tr-TR',
                                                },
                                                'Türk',
                                            ),
                                            option(
                                                {
                                                    value: 'pt-PT',
                                                    selected: this.state.teacherLang === 'pt-PT',
                                                },
                                                'Português',
                                            ),
                                        ),
                                    ),
                                ),
                                div('.status-area'),
                            ),
                        ),
                        div(
                            '.flex-justify-end.margin-top-10',
                            div(
                                '#edit-teacher-cancel.button-passive',
                                {
                                    onclick: () => {
                                        window.location.href = `//${window.location.host}/`;
                                    },
                                },
                                await window.beaconingAPI.getPhrase('cancel'),
                            ),
                            div(
                                '#edit-teacher-button.button-submit',
                                {
                                    onclick: (event) => {
                                        const { target } = event;
                                        this.editTeacher();

                                        target.textContent = `${updatingText}...`;
                                    },
                                },
                                await window.beaconingAPI.getPhrase('update'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default ProfileEditForm;
