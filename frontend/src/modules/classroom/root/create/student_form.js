// @flow
import {
    section,
    div,
    a,
    i,
    h1,
    form,
    input,
    label,
    span,
    select,
    option,
} from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';
import PostCreation from './post_creation';
import nullishCheck from '../../../../core/util';

class StudentForm extends Component {
    stateObj = {
        studentUsername: '',
        studentFirstName: '',
        studentLastName: '',
        studentLang: 'en-GB',
        studentYearGroup: '',
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

    updateHooks = {
        ResetForm: this.resetForm,
    };

    enabledErrors = [];

    students = [];

    processStudents(studentsArr) {
        for (const obj of studentsArr) {
            this.students.push(obj?.username);
        }

        // console.log(this.students);
    }

    async init() {
        const students = await window.beaconingAPI.getStudents();

        if (students) {
            this.processStudents(students);
        }
    }

    async resetForm() {
        this.state = {
            studentUsername: '',
            studentFirstName: '',
            studentLastName: '',
            studentLang: 'en-GB',
            studentYearGroup: '',
        };

        this.removeErrors();

        this.updateView(await this.render());
    }

    async resetSubmit() {
        const studentButton = document.getElementById('create-student-button');
        studentButton.textContent = await window.bcnI18n.getPhrase('cr_create_student');
    }

    removeErrors() {
        for (const v of this.enabledErrors) {
            this.removeError(v);
        }
    }

    addError(elementID: string, errMsg: string) {
        const el = document.getElementById(elementID);
        const labelGroup = el?.parentElement?.parentElement;
        const errEl = div(
            '.flex-align-center',
            i('.icon-cancel', { attrs: { 'aria-hidden': true } }),
            span(errMsg),
        );

        if (this.enabledErrors.indexOf(elementID) === -1) {
            this.enabledErrors.push(elementID);
        }

        if (nullishCheck(el, false) && nullishCheck(labelGroup, false)) {
            labelGroup.classList.remove('loading');
            labelGroup.classList.remove('success');
            labelGroup.classList.add('error');
            // console.log(el);
            if (el.childElementCount > 0) {
                el.replaceChild(errEl, el.firstElementChild);
            }

            el.appendChild(errEl);
        }
    }

    addLoading(elementID: string) {
        const el = document.getElementById(elementID);
        const labelGroup = el?.parentElement?.parentElement;
        const loadingEl = i('.icon-load', { attrs: { 'aria-hidden': true } });

        if (nullishCheck(el, false) && nullishCheck(labelGroup, false)) {
            labelGroup.classList.remove('error');
            labelGroup.classList.remove('success');
            labelGroup.classList.add('loading');
            if (el.childElementCount > 0) {
                el.replaceChild(loadingEl, el.firstElementChild);
            }

            el.appendChild(loadingEl);
        }
    }

    addSuccess(elementID: string) {
        const el = document.getElementById(elementID);
        const labelGroup = el?.parentElement?.parentElement;
        const successEl = i('.icon-ok', { attrs: { 'aria-hidden': true } });

        if (nullishCheck(el, false) && nullishCheck(labelGroup, false)) {
            if (this.enabledErrors.indexOf(elementID) !== -1) {
                delete this.enabledErrors[elementID];
                labelGroup.classList.remove('error');
            }

            labelGroup.classList.remove('loading');
            labelGroup.classList.add('success');
            if (el.childElementCount > 0) {
                el.replaceChild(successEl, el.firstElementChild);
            }

            el.appendChild(successEl);
        }
    }

    removeError(elementID: string) {
        if (this.enabledErrors.indexOf(elementID) !== -1) {
            const el = document.getElementById(elementID);
            const labelGroup = el?.parentElement?.parentElement;

            if (nullishCheck(el, false) && nullishCheck(labelGroup, false)) {
                labelGroup.classList.remove('error');
                el.innerHTML = '';
            }

            delete this.enabledErrors[elementID];
        }
    }

    removeAll(elementID: string) {
        const el = document.getElementById(elementID);
        const labelGroup = el?.parentElement?.parentElement;

        if (nullishCheck(el, false) && nullishCheck(labelGroup, false)) {
            labelGroup.classList.remove('loading');
            labelGroup.classList.remove('success');

            if (this.enabledErrors.indexOf(elementID) !== -1) {
                delete this.enabledErrors[elementID];
                labelGroup.classList.remove('error');
            }

            el.innerHTML = '';
        }
    }

    async checkUsername() {
        if (this.state.studentUsername === '') {
            this.removeAll('student-username-status');

            return true;
        }

        if (this.students.indexOf(this.state.studentUsername) !== -1) {
            const errMsg = await window.bcnI18n.getPhrase('username_exists');
            this.addError('student-username-status', errMsg);

            return false;
        }

        this.addSuccess('student-username-status');
        return true;
    }

    async checkFields() {
        let success = true;
        const emptyMsg = await window.bcnI18n.getPhrase('required_empty');

        this.removeErrors();

        if (this.state.studentUsername === '') {
            this.addError('student-username-status', emptyMsg);
            success = false;
        }

        if (this.state.studentUsername !== '' && !(await this.checkUsername())) {
            success = false;
        }

        if (this.state.studentFirstName === '') {
            this.addError('student-fn-status', emptyMsg);
            success = false;
        }

        if (this.state.studentLastName === '') {
            this.addError('student-ln-status', emptyMsg);
            success = false;
        }

        if (this.state.studentYearGroup === '') {
            this.addError('student-yg-status', emptyMsg);
            success = false;
        }

        if (!success) {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Error',
                type: 'error',
                message: await window.bcnI18n.getPhrase('form_error'),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        return true;
    }

    async createStudent() {
        if (await this.checkFields() === false) {
            return;
        }

        const obj = {
            username: this.state.studentUsername,
            language: this.state.studentLang,
            profile: {
                firstName: this.state.studentFirstName,
                lastName: this.state.studentLastName,
                yearGroup: this.state.yearGroup,
            },
        };

        // console.log(obj);

        const status = await window.beaconingAPI.addStudent(obj);
        const statusMessage = new Status();

        console.log('[Create Student] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            this.resetSubmit();
            this.afterCreation(status);

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('student_nc'),
        });

        this.appendView(statusMessageEl);

        this.resetSubmit();
    }

    async afterCreation(student: Object) {
        const pcEL = new PostCreation().attach({
            title: await window.bcnI18n.getPhrase('student_cre'),
            id: student.id,
        });

        this.updateView(await pcEL);
    }

    async render() {
        const creatingText = await window.bcnI18n.getPhrase('creating');

        return div(
            '.flex-column',
            section(
                '.flex-column',
                div(
                    '#section-header',
                    a(
                        '.back',
                        {
                            href: `//${window.location.host}/classroom`,
                        },
                        i('.icon-angle-left'),
                        await window.bcnI18n.getPhrase('go_back'),
                    ),
                    h1(await window.bcnI18n.getPhrase('cr_create_student')),
                    div('.empty-spacer', ' '),
                ),
            ),
            section(
                '.flex-column',
                div(
                    '.flex-column',
                    form(
                        '.create-student',
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.bcnI18n.getPhrase('cr_student_username'))),
                                div('.desc-area', await window.bcnI18n.getPhrase('cr_student_username_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#student-username.text-field',
                                            {
                                                type: 'text',
                                                placeholder: await window.bcnI18n.getPhrase('cr_enter_username'),
                                                oninput: (event) => {
                                                    const { target } = event;

                                                    this.state.studentUsername = target.value;
                                                    this.addLoading('student-username-status');
                                                    this.checkUsername();
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#student-username-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.bcnI18n.getPhrase('cr_student_fn'))),
                                div('.desc-area', await window.bcnI18n.getPhrase('cr_student_fn_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#student-first-name.text-field',
                                            {
                                                type: 'text',
                                                placeholder: await window.bcnI18n.getPhrase('cr_enter_fn'),
                                                oninput: (event) => {
                                                    const { target } = event;

                                                    this.state.studentFirstName = target.value;
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#student-fn-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.bcnI18n.getPhrase('cr_student_ln'))),
                                div('.desc-area', await window.bcnI18n.getPhrase('cr_student_ln_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#student-last-name.text-field',
                                            {
                                                type: 'text',
                                                placeholder: await window.bcnI18n.getPhrase('cr_enter_ln'),
                                                oninput: (event) => {
                                                    const { target } = event;

                                                    this.state.studentLastName = target.value;
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#student-ln-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.bcnI18n.getPhrase('cr_student_yg'))),
                                div('.desc-area', await window.bcnI18n.getPhrase('cr_student_yg_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#student-year-group.text-field',
                                            {
                                                type: 'text',
                                                placeholder: await window.bcnI18n.getPhrase('cr_enter_yg'),
                                                oninput: (event) => {
                                                    const { target } = event;

                                                    this.state.studentYearGroup = target.value;
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#student-yg-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.bcnI18n.getPhrase('cr_student_lang'))),
                                div('.desc-area', await window.bcnI18n.getPhrase('cr_student_lang_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.select',
                                        select(
                                            '#student-lang',
                                            {
                                                onchange: (event) => {
                                                    const { target } = event;

                                                    this.state.studentLang = target.value;
                                                },
                                            },
                                            option(
                                                {
                                                    value: 'en-GB',
                                                },
                                                'English',
                                            ),
                                            option(
                                                {
                                                    value: 'fr-FR',
                                                },
                                                'Français',
                                            ),
                                            option(
                                                {
                                                    value: 'es-ES',
                                                },
                                                'Español',
                                            ),
                                            option(
                                                {
                                                    value: 'it-IT',
                                                },
                                                'Italiano',
                                            ),
                                            option(
                                                {
                                                    value: 'de-DE',
                                                },
                                                'Deutsch',
                                            ),
                                            option(
                                                {
                                                    value: 'ro-RO',
                                                },
                                                'Română',
                                            ),
                                            option(
                                                {
                                                    value: 'pl-PL',
                                                },
                                                'Polskie',
                                            ),
                                            option(
                                                {
                                                    value: 'tr-TR',
                                                },
                                                'Türk',
                                            ),
                                            option(
                                                {
                                                    value: 'pt-PT',
                                                },
                                                'Português',
                                            ),
                                        ),
                                    ),
                                ),
                                div('.status-area'),
                            ),
                        ),
                        // div(
                        //     '.label-group',
                        //     div(
                        //         '.split',
                        //         div('.title-area', span(await window.bcnI18n.getPhrase('cr_student_email'))),
                        //         div('.desc-area', await window.bcnI18n.getPhrase('cr_student_email_desc')),
                        //         div(
                        //             '.input-area',
                        //             label(
                        //                 input(
                        //                     '#student-email.text-field',
                        //                     {
                        //                         type: 'email',
                        //                         placeholder: await window.bcnI18n.getPhrase('cr_enter_email'),
                        //                         oninput: (event) => {
                        //                             const { target } = event;

                        //                             this.state.studentEmail = target.value;
                        //                         },
                        //                     },
                        //                 ),
                        //             ),
                        //         ),
                        //         div('.status-area'),
                        //     ),
                        // ),
                        div(
                            '.flex-justify-end.margin-top-10',
                            div(
                                '#create-student-button.button-submit',
                                {
                                    onclick: (event) => {
                                        const { target } = event;
                                        this.createStudent();

                                        target.textContent = `${creatingText}...`;
                                    },
                                },
                                await window.bcnI18n.getPhrase('cr_create_student'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default StudentForm;
