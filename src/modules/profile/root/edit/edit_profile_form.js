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
        this.state.trans = await window.beaconingAPI.getPhrases(
            'update',
            'err_required_empty',
            'err_form',
            'teacher_edited',
            'err_teacher_ne',
            'updating',
            'go_back',
            'pf_editing_profile',
            'pf_teacher_fn',
            'pf_teacher_fn_desc',
            'pf_teacher_fn_enter',
            'pf_teacher_ln',
            'pf_teacher_ln_desc',
            'pf_teacher_ln_enter',
            'pf_teacher_gender',
            'pf_teacher_gender_desc',
            'female',
            'male',
            'other',
            'prefer_nts',
            'pf_teacher_school',
            'pf_teacher_school_desc',
            'pf_teacher_school_enter',
            'pf_teacher_email',
            'pf_teacher_email_desc',
            'pf_teacher_email_enter',
            'pf_teacher_language',
            'pf_teacher_language_desc',
            'cancel',
            'update',
        );
    }

    async resetSubmit() {
        const updateButton = document.getElementById('edit-teacher-button');
        updateButton.textContent = this.state.trans.get('update');
    }

    async checkFields() {
        let success = true;
        const emptyMsg = this.state.trans.get('err_required_empty');

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
                message: this.state.trans.get('err_form'),
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

        const status = await window.beaconingAPI.editUser(obj);
        const statusMessage = new Status();

        console.log('[Edit Teacher] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: this.state.trans.get('teacher_edited'),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: this.state.trans.get('err_teacher_ne'),
        });

        this.resetSubmit();

        this.appendView(statusMessageEl);
    }

    async renderFirstName() {
        return div(
            '.label-group',
            div(
                '.split',
                div('.title-area', span(this.state.trans.get('pf_teacher_fn'))),
                div('.desc-area', this.state.trans.get('pf_teacher_fn_desc')),
                div(
                    '.input-area',
                    label(
                        '.required',
                        input(
                            '#teacher-first-name.text-field',
                            {
                                type: 'text',
                                placeholder: this.state.trans.get('pf_teacher_fn_enter'),
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
        );
    }

    async renderLastName() {
        return div(
            '.label-group',
            div(
                '.split',
                div('.title-area', span(this.state.trans.get('pf_teacher_ln'))),
                div('.desc-area', this.state.trans.get('pf_teacher_ln_desc')),
                div(
                    '.input-area',
                    label(
                        '.required',
                        input(
                            '#teacher-last-name.text-field',
                            {
                                type: 'text',
                                placeholder: this.state.trans.get('pf_teacher_ln_enter'),
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
        );
    }

    async renderProfilePicture() {
        return div(
            '.label-group',
            div(
                '.split',
                div('.title-area', span('Profile Picture')),
                div('.desc-area', 'Upload a profile picture'),
                div(
                    '.input-area',
                    label(
                        input(
                            '#teacher-email.text-field',
                            {
                                type: 'file',
                                placeholder: 'Upload a picture',
                                accept: 'image/png',
                                oninput: (event) => {
                                    const { target } = event;
                                },
                            },
                        ),
                    ),
                ),
                div('.status-area'),
            ),
        );
    }

    async renderGender() {
        const genderMap = {
            'male': 'male',
            'female': 'female',
            'other': 'other',
            'pnts': 'prefer_nts',
        };

        const optionSet = Object.keys(genderMap).map((key, i, a) => {
            return option(
                {
                    value: key,
                    selected: this.state.teacherGender === key,
                },
                this.state.trans.get(genderMap[key]),
            );
        });
        
        return div(
            '.label-group',
            div(
                '.split',
                div('.title-area', span(this.state.trans.get('pf_teacher_gender'))),
                div('.desc-area', this.state.trans.get('pf_teacher_gender_desc')),
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
                            optionSet,
                        ),
                    ),
                ),
                div('.status-area'),
            ),
        );
    }

    async renderSchool() {
        return div(
            '.label-group',
            div(
                '.split',
                div('.title-area', span(this.state.trans.get('pf_teacher_school'))),
                div('.desc-area', this.state.trans.get('pf_teacher_school_desc')),
                div(
                    '.input-area',
                    label(
                        input(
                            '#teacher-school.text-field',
                            {
                                type: 'text',
                                placeholder: this.state.trans.get('pf_teacher_school_enter'),
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
        );
    }

    async renderEmail() {
        return div(
            '.label-group',
            div(
                '.split',
                div('.title-area', span(this.state.trans.get('pf_teacher_email'))),
                div('.desc-area', this.state.trans.get('pf_teacher_email_desc')),
                div(
                    '.input-area',
                    label(
                        input(
                            '#teacher-email.text-field',
                            {
                                type: 'text',
                                placeholder: this.state.trans.get('pf_teacher_email_enter'),
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
        );
    }

    async renderLanguage() {
        const languageMap = {
            'en-GB': 'English',
            'fr-FR': 'Français',
            'es-ES': 'Español',
            'it-IT': 'Italiano',
            'de-DE': 'Deutsch',
            'ro-RO': 'Română',
            'pl-PL': 'Polskie',
            'tr-TR': 'Türk',
            'pt-PT': 'Português',
        };

        const optionSet = Object.keys(languageMap).map((key) => {
            return option(
                {
                    value: key,
                    selected: this.state.teacherLang === key,
                },
                languageMap[key],
            );
        });

        return div(
            '.label-group',
            div(
                '.split',
                div('.title-area', span(this.state.trans.get('pf_teacher_language'))),
                div('.desc-area', this.state.trans.get('pf_teacher_language_desc')),
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
                            optionSet,
                        ),
                    ),
                ),
                div('.status-area'),
            ),
        );
    }

    async render() {
        const updatingText = this.state.trans.get('updating');

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
                        this.state.trans.get('go_back'),
                    ),
                    h1(this.state.trans.get('pf_editing_profile')),
                    div('.empty-spacer', ' '),
                ),
            ),
            section(
                '.flex-column',
                div(
                    '.flex-column',
                    form(
                        '.edit-teacher',
                        
                        await this.renderFirstName(),
                        await this.renderLastName(),
                        // await this.renderProfilePicture(),
                        await this.renderGender(),
                        await this.renderSchool(),
                        await this.renderEmail(),
                        await this.renderLanguage(),

                        div(
                            '.flex-justify-end.margin-top-10',
                            div(
                                '#edit-teacher-cancel.button-passive',
                                {
                                    onclick: () => {
                                        window.location.href = `//${window.location.host}/`;
                                    },
                                },
                                this.state.trans.get('cancel'),
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
                                this.state.trans.get('update'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default ProfileEditForm;
