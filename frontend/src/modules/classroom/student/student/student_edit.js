// @flow
import {
    section,
    div,
    form,
    p,
    input,
    label,
    span,
    select,
    option,
} from '../../../../core/html';

import Form from '../../../form';
import Status from '../../../status';

class StudentEdit extends Form {
    student = {};

    students = [];

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

    enabledErrors = [];

    processStudents(studentsArr) {
        for (const obj of studentsArr) {
            this.students.push(obj?.username.toLowerCase());
        }

        // console.log(this.students);
    }

    async init() {
        if (!this.props.id) {
            throw new Error('[Student Edit] No student ID provided');
        }

        const student = await window.beaconingAPI.getStudent(this.props.id);
        const students = await window.beaconingAPI.getStudents();

        if (student) {
            this.student = student;

            this.state = {
                studentUsername: student?.username || '',
                studentFirstName: student?.profile?.firstName || '',
                studentLastName: student?.profile?.lastName || '',
                studentLang: student?.language || 'en-GB',
                studentYearGroup: student?.profile?.yearGroup || '',
            };

            return;
        }

        if (students) {
            this.processStudents(students);
        }

        throw new Error('[Student Edit] Student not found!');
    }

    async changeButtons(completed: boolean) {
        const doneButton = document.getElementById('edit-student-done');
        const studentButton = document.getElementById('update-student-button');

        if (completed) {
            studentButton.textContent = await window.bcnI18n.getPhrase('cr_student_update');
            doneButton.textContent = await window.bcnI18n.getPhrase('done');

            return;
        }

        studentButton.textContent = await window.bcnI18n.getPhrase('cr_student_update');
        doneButton.textContent = await window.bcnI18n.getPhrase('cancel');
    }

    async checkUsername() {
        if (this.state.studentUsername === '') {
            this.removeAll('student-username-status');

            return true;
        }

        if (this.state.studentUsername !== this.student.username && this.students.indexOf(this.state.studentUsername.toLowerCase()) !== -1) {
            const errMsg = await window.bcnI18n.getPhrase('err_username_exists');
            this.addError('student-username-status', errMsg);

            return false;
        }

        this.addSuccess('student-username-status');
        return true;
    }

    async checkFields() {
        let success = true;
        const emptyMsg = await window.bcnI18n.getPhrase('err_required_empty');

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
                message: await window.bcnI18n.getPhrase('err_form'),
            });

            this.appendView(statusMessageEl);

            this.changeButtons(false);

            return false;
        }

        return true;
    }

    async updateStudent() {
        if (await this.checkFields() === false) {
            return;
        }

        const obj = {
            id: this.student.id,
            username: this.state.studentUsername,
            language: this.state.studentLang,
            profile: {
                firstName: this.state.studentFirstName,
                lastName: this.state.studentLastName,
                yearGroup: this.state.studentYearGroup,
            },
        };

        // console.log(obj);

        const status = await window.beaconingAPI.updateStudent(this.student.id, obj);
        const statusMessage = new Status();

        console.log('[Update Student] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: await window.bcnI18n.getPhrase('sc_student_up'),
            });

            this.appendView(statusMessageEl);

            this.changeButtons(true);

            this.emit('StudentNameUpdate');

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('err_student_nu'),
        });

        this.changeButtons(false);

        this.appendView(statusMessageEl);
    }

    async render() {
        const updatingText = await window.bcnI18n.getPhrase('updating');

        return div(
            '.flex-column',
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p(`${await window.bcnI18n.getPhrase('cr_edit_student_info')}:`),
                    ),
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
                                                value: this.state.studentUsername,
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
                                                value: this.state.studentFirstName,
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
                                                value: this.state.studentLastName,
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
                                                value: this.state.studentYearGroup,
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
                                                    selected: this.state.studentLanguage === 'en-GB',
                                                },
                                                'English',
                                            ),
                                            option(
                                                {
                                                    value: 'fr-FR',
                                                    selected: this.state.studentLanguage === 'fr_FR',
                                                },
                                                'Français',
                                            ),
                                            option(
                                                {
                                                    value: 'es-ES',
                                                    selected: this.state.studentLanguage === 'es-ES',
                                                },
                                                'Español',
                                            ),
                                            option(
                                                {
                                                    value: 'it-IT',
                                                    selected: this.state.studentLanguage === 'it-IT',
                                                },
                                                'Italiano',
                                            ),
                                            option(
                                                {
                                                    value: 'de-DE',
                                                    selected: this.state.studentLanguage === 'de-DE',
                                                },
                                                'Deutsch',
                                            ),
                                            option(
                                                {
                                                    value: 'ro-RO',
                                                    selected: this.state.studentLanguage === 'ro-RO',
                                                },
                                                'Română',
                                            ),
                                            option(
                                                {
                                                    value: 'pl-PL',
                                                    selected: this.state.studentLanguage === 'pl-PL',
                                                },
                                                'Polskie',
                                            ),
                                            option(
                                                {
                                                    value: 'tr-TR',
                                                    selected: this.state.studentLanguage === 'tr-TR',
                                                },
                                                'Türk',
                                            ),
                                            option(
                                                {
                                                    value: 'pt-PT',
                                                    selected: this.state.studentLanguage === 'pt-PT',
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
                                '#edit-student-done.button-passive',
                                {
                                    onclick: () => {
                                        this.emit('EditDoneClicked');
                                    },
                                },
                                await window.bcnI18n.getPhrase('cancel'),
                            ),
                            div(
                                '#update-student-button.button-submit',
                                {
                                    onclick: (event) => {
                                        const { target } = event;
                                        this.updateStudent();

                                        target.textContent = `${updatingText}...`;
                                    },
                                },
                                await window.bcnI18n.getPhrase('cr_student_update'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default StudentEdit;
