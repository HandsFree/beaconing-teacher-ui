// @flow
import { section, div, form, p, input, label, span, select, option } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';
import nullishCheck from '../../../../core/util';

class StudentEdit extends Component {
    state = {
        student: {},
        studentUsername: '',
        studentFirstName: '',
        studentLastName: '',
        studentDOB: '',
        studentEmail: '',
        studentAddress: {
            line1: '',
            line2: '',
            city: '',
            country: '',
            county: '',
            postcode: '',
        },
        studentLang: 'en-GB',
        studentGender: '',
        studentSchool: '',
    };

    async init() {
        if (!this.props.id) {
            throw new Error('[Student Edit] No student ID provided');
        }

        const student = await window.beaconingAPI.getStudent(this.props.id);

        if (student) {
            this.state.student = student;

            this.state.studentUsername = nullishCheck(student?.username, '');
            this.state.studentFirstName = nullishCheck(student?.profile?.firstName, '');
            this.state.studentLastName = nullishCheck(student?.profile?.lastName, '');
            this.state.studentDOB = nullishCheck(student?.profile?.DOB, '');
            this.state.studentEmail = nullishCheck(student?.email, '');
            this.state.studentAddress = nullishCheck(student?.profile?.address, {
                line1: '',
                line2: '',
                city: '',
                country: '',
                county: '',
                postcode: '',
            });
            this.state.studentLang = nullishCheck(student?.language, 'en-GB');
            this.state.studentGender = nullishCheck(student?.profile?.gender, 'male');
            this.state.studentSchool = nullishCheck(student?.profile?.school, '');

            return;
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

    async checkFields() {
        // TODO: reduce duped code
        if (this.state.studentUsername === '') {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'student-username',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('empty_field')).replace('%s', `'${await window.bcnI18n.getPhrase('cr_student_username')}'`),
            });

            this.appendView(statusMessageEl);

            this.changeButtons(false);

            return false;
        }

        if (this.state.studentFirstName === '') {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'student-first-name',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('empty_field')).replace('%s', `'${await window.bcnI18n.getPhrase('cr_student_fn')}'`),
            });

            this.appendView(statusMessageEl);

            this.changeButtons(false);

            return false;
        }

        if (this.state.studentLastName === '') {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'student-last-name',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('empty_field')).replace('%s', `'${await window.bcnI18n.getPhrase('cr_student_ln')}'`),
            });

            this.appendView(statusMessageEl);

            this.changeButtons(false);

            return false;
        }

        if (this.state.studentDOB === '') {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'student-dob',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('empty_field')).replace('%s', `'${await window.bcnI18n.getPhrase('cr_student_dob')}'`),
            });

            this.appendView(statusMessageEl);

            this.changeButtons(false);

            return false;
        }

        const now = new Date();
        const parsedDate = new Date(this.state.studentDOB);

        /* eslint-disable-next-line no-restricted-globals */
        if (isNaN(parsedDate)) {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'student-dob',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('not_valid_dob')),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        if (parsedDate.getTime() > now.getTime()) {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'student-dob',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('not_valid_dob')),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        return true;
    }

    async updateStudent() {
        if (await this.checkFields() === false) {
            return;
        }

        const { student } = this.state;

        const obj = {
            id: student.id,
            username: this.state.studentUsername === '' ? student.username : this.state.studentUsername,
            email: this.state.studentEmail === '' ? null : this.state.studentEmail,
            language: this.state.studentLang,
            profile: {
                firstName: this.state.studentFirstName === '' ? student.profile.firstName : this.state.studentFirstName,
                lastName: this.state.studentLastName === '' ? student.profile.lastName : this.state.studentLastName,
                DOB: this.state.studentDOB === '' ? student.profile.DOB : this.state.studentDOB,
                gender: this.state.studentGender === '' ? student.profile.studentGender : this.state.studentGender,
                school: this.state.studentSchool === '' ? student.profile.studentSchool : this.state.studentSchool,
                address: {
                    line1: this.state.studentAddress.line1 === '' ? student.profile.address.line1 : this.state.studentAddress.line1,
                    line2: this.state.studentAddress.line2 === '' ? student.profile.address.line2 : this.state.studentAddress.line2,
                    city: this.state.studentAddress.city === '' ? student.profile.address.city : this.state.studentAddress.city,
                    country: this.state.studentAddress.country === '' ? student.profile.address.country : this.state.studentAddress.country,
                    county: this.state.studentAddress.county === '' ? student.profile.address.county : this.state.studentAddress.county,
                    postcode: this.state.studentAddress.postcode === '' ? student.profile.address.postcode : this.state.studentAddress.postcode,
                },
            },
        };

        console.log(obj);

        const status = await window.beaconingAPI.updateStudent(this.state.student.id, obj);
        const statusMessage = new Status();

        console.log('[Update Student] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: await window.bcnI18n.getPhrase('student_up'),
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
            message: await window.bcnI18n.getPhrase('student_nu'),
        });

        this.changeButtons(false);

        this.appendView(statusMessageEl);
    }

    async render() {
        const { student } = this.state;

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
                        label(
                            span(await window.bcnI18n.getPhrase('cr_student_username')),
                            input(
                                '#student-username.text-field',
                                {
                                    type: 'text',
                                    value: student.username,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentUsername = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('cr_student_fn')),
                            input(
                                '#student-first-name.text-field',
                                {
                                    type: 'text',
                                    value: student.profile.firstName,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentFirstName = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('cr_student_ln')),
                            input(
                                '#student-last-name.text-field',
                                {
                                    type: 'text',
                                    value: student.profile.lastName,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentLastName = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            '.select',
                            span(await window.bcnI18n.getPhrase('cr_student_gender')),
                            select(
                                '#student-gender',
                                {
                                    onchange: (event) => {
                                        const { target } = event;

                                        this.state.studentGender = target.value;
                                    },
                                },
                                option(
                                    {
                                        value: 'female',
                                        selected: student.profile.gender === 'female',
                                    },
                                    await window.bcnI18n.getPhrase('female'),
                                ),
                                option(
                                    {
                                        value: 'male',
                                        selected: student.profile.gender === 'male',
                                    },
                                    await window.bcnI18n.getPhrase('male'),
                                ),
                                option(
                                    {
                                        value: 'other',
                                        selected: student.profile.gender === 'other',
                                    },
                                    await window.bcnI18n.getPhrase('other'),
                                ),
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('cr_student_dob')),
                            input(
                                '#student-dob.text-field',
                                {
                                    type: 'date',
                                    value: student.profile.DOB,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentDOB = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            '.select',
                            span(await window.bcnI18n.getPhrase('cr_student_lang')),
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
                                        selected: student.language === 'en-GB',
                                    },
                                    'English',
                                ),
                                option(
                                    {
                                        value: 'fr-FR',
                                        selected: student.language === 'fr_FR',
                                    },
                                    'Français',
                                ),
                                option(
                                    {
                                        value: 'es-ES',
                                        selected: student.language === 'es-ES',
                                    },
                                    'Español',
                                ),
                                option(
                                    {
                                        value: 'it-IT',
                                        selected: student.language === 'it-IT',
                                    },
                                    'Italiano',
                                ),
                                option(
                                    {
                                        value: 'de-DE',
                                        selected: student.language === 'de-DE',
                                    },
                                    'Deutsch',
                                ),
                                option(
                                    {
                                        value: 'ro-RO',
                                        selected: student.language === 'ro-RO',
                                    },
                                    'Română',
                                ),
                                option(
                                    {
                                        value: 'pl-PL',
                                        selected: student.language === 'pl-PL',
                                    },
                                    'Polskie',
                                ),
                                option(
                                    {
                                        value: 'tr-TR',
                                        selected: student.language === 'tr-TR',
                                    },
                                    'Türk',
                                ),
                                option(
                                    {
                                        value: 'pt-PT',
                                        selected: student.language === 'pt-PT',
                                    },
                                    'Português',
                                ),
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('cr_student_email')),
                            input(
                                '#student-email.text-field',
                                {
                                    type: 'email',
                                    placeholder: await window.bcnI18n.getPhrase('cr_enter_new_email'),
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentEmail = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('cr_student_school')),
                            input(
                                '#student-school.text-field',
                                {
                                    type: 'text',
                                    value: student.profile.school,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentSchool = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('cr_student_address')),
                            input(
                                '#student-address1.text-field',
                                {
                                    type: 'text',
                                    value: student.profile.address.line1,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentAddress.line1 = target.value;
                                    },
                                },
                            ),
                            input(
                                '#student-address2.text-field',
                                {
                                    type: 'text',
                                    value: student.profile.address.line2,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentAddress.line2 = target.value;
                                    },
                                },
                            ),
                            input(
                                '#student-address-city.text-field',
                                {
                                    type: 'text',
                                    value: student.profile.address.city,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentAddress.city = target.value;
                                    },
                                },
                            ),
                            input(
                                '#student-address-county.text-field',
                                {
                                    type: 'text',
                                    value: student.profile.address.county,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentAddress.county = target.value;
                                    },
                                },
                            ),
                            input(
                                '#student-address-country.text-field',
                                {
                                    type: 'text',
                                    value: student.profile.address.country,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentAddress.country = target.value;
                                    },
                                },
                            ),
                            input(
                                '#student-address-code.text-field',
                                {
                                    type: 'text',
                                    value: student.profile.address.postcode,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentAddress.postcode = target.value;
                                    },
                                },
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
                                    '#update-student-button.button-action',
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
            ),
        );
    }
}

export default StudentEdit;
