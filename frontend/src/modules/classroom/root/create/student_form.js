// @flow
import { section, div, a, i, h1, form, input, p, label, span, select, option } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

class GroupForm extends Component {
    state = {
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

    async createStudent() {
        const obj = {
            username: this.state.studentUsername,
            email: this.state.studentEmail,
            language: this.state.studentLang,
            profile: {
                firstName: this.state.studentFirstName,
                lastName: this.state.studentLastName,
                DOB: this.state.studentDOB,
                gender: this.state.studentGender,
                school: this.state.studentSchool,
                address: {
                    line1: this.state.studentAddress.line1,
                    line2: this.state.studentAddress.line2,
                    city: this.state.studentAddress.city,
                    country: this.state.studentAddress.country,
                    county: this.state.studentAddress.county,
                    postcode: this.state.studentAddress.postcode,
                },
            },
        };

        // console.log(obj);

        const status = await window.beaconingAPI.addStudent(obj);
        const statusMessage = new Status();

        console.log('[Create Student] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: `student '${this.state.studentUsername}' created`,
            });

            this.appendView(statusMessageEl);

            const studentButton = document.getElementById('create-student-button');

            studentButton.textContent = await window.bcnI18n.getPhrase('cr_create_student');

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('student_nc'),
        });

        const studentButton = document.getElementById('create-student-button');

        studentButton.textContent = await window.bcnI18n.getPhrase('cr_create_student');

        this.appendView(statusMessageEl);
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
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p(`${await window.bcnI18n.getPhrase('cr_enter_si')}:`),
                    ),
                    form(
                        '.create-student',
                        label(
                            span(await window.bcnI18n.getPhrase('cr_student_username')),
                            input(
                                '#student-username.text-field',
                                {
                                    type: 'text',
                                    placeholder: await window.bcnI18n.getPhrase('cr_enter_username'),
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
                                    placeholder: await window.bcnI18n.getPhrase('cr_enter_fn'),
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
                                    placeholder: await window.bcnI18n.getPhrase('cr_enter_ln'),
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
                                option({ value: 'male' }, await window.bcnI18n.getPhrase('male')),
                                option({ value: 'female' }, await window.bcnI18n.getPhrase('female')),
                                option({ value: 'other' }, await window.bcnI18n.getPhrase('other')),
                            ),
                        ),
                        label(
                            span(await window.bcnI18n.getPhrase('cr_student_dob')),
                            input(
                                '#student-dossignedb.text-field',
                                {
                                    type: 'date',
                                    placeholder: await window.bcnI18n.getPhrase('cr_enter_dob'),
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
                                    'Deutsche',
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
                        label(
                            span(await window.bcnI18n.getPhrase('cr_student_email')),
                            input(
                                '#student-email.text-field',
                                {
                                    type: 'email',
                                    placeholder: await window.bcnI18n.getPhrase('cr_enter_email'),
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
                                    placeholder: await window.bcnI18n.getPhrase('cr_enter_school'),
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
                                    placeholder: await window.bcnI18n.getPhrase('cr_student_adrs_ln1'),
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
                                    placeholder: await window.bcnI18n.getPhrase('cr_student_adrs_ln2'),
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
                                    placeholder: await window.bcnI18n.getPhrase('cr_student_adrs_city'),
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
                                    placeholder: await window.bcnI18n.getPhrase('cr_student_adrs_county'),
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
                                    placeholder: await window.bcnI18n.getPhrase('cr_student_adrs_country'),
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
                                    placeholder: await window.bcnI18n.getPhrase('cr_student_adrs_pc'),
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentAddress.postcode = target.value;
                                    },
                                },
                            ),
                            div(
                                '.flex-justify-end.margin-top-10',
                                div(
                                    '#create-student-button.button-action',
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
            ),
        );
    }
}

export default GroupForm;
