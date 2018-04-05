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
        studentLang: 'en-US',
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

            studentButton.textContent = 'Create Student';

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: 'student not created!',
        });

        const studentButton = document.getElementById('create-student-button');

        studentButton.textContent = 'Create Student';

        this.appendView(statusMessageEl);
    }

    async render() {
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
                        'Go Back',
                    ),
                    h1('Create Student'),
                    div('.empty-spacer', ' '),
                ),
            ),
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p('Enter Student information:'),
                    ),
                    form(
                        '.create-student',
                        label(
                            span('Student Username'),
                            input(
                                '#student-username.text-field',
                                {
                                    type: 'text',
                                    placeholder: 'Enter Username',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentUsername = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Student First Name'),
                            input(
                                '#student-first-name.text-field',
                                {
                                    type: 'text',
                                    placeholder: 'Enter First Name',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentFirstName = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Student Last Name'),
                            input(
                                '#student-last-name.text-field',
                                {
                                    type: 'text',
                                    placeholder: 'Enter Last Name',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentLastName = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            '.select',
                            span('Student Gender'),
                            select(
                                '#student-gender',
                                {
                                    onchange: (event) => {
                                        const { target } = event;

                                        this.state.studentGender = target.value;
                                    },
                                },
                                option({ value: 'male' }, 'Male'),
                                option({ value: 'female' }, 'Female'),
                                option({ value: 'other' }, 'Other'),
                            ),
                        ),
                        label(
                            span('Student Date of Birth'),
                            input(
                                '#student-dossignedb.text-field',
                                {
                                    type: 'date',
                                    placeholder: 'Enter DoB',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentDOB = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            '.select',
                            span('Student Language'),
                            select(
                                '#student-lang',
                                {
                                    onchange: (event) => {
                                        const { target } = event;

                                        this.state.studentLang = target.value;
                                    },
                                },
                                option({ value: 'en-US' }, 'English'),
                            ),
                        ),
                        label(
                            span('Student Email'),
                            input(
                                '#student-email.text-field',
                                {
                                    type: 'email',
                                    placeholder: 'Enter Email',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentEmail = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Student School'),
                            input(
                                '#student-school.text-field',
                                {
                                    type: 'text',
                                    placeholder: 'Enter School Name',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentSchool = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            span('Student Address'),
                            input(
                                '#student-address1.text-field',
                                {
                                    type: 'text',
                                    placeholder: 'Address Line 1',
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
                                    placeholder: 'Address Line 2',
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
                                    placeholder: 'City',
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
                                    placeholder: 'Province/County',
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
                                    placeholder: 'Country',
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
                                    placeholder: 'Post Code',
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

                                            target.textContent = 'Creating...';
                                        },
                                    },
                                    'Create Student',
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
