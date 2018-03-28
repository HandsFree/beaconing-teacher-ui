// @flow
import { section, div, form, p, button, input, label, span, a } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';

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
    };

    async init() {
        if (!this.props.id) {
            throw new Error('[Student Edit] no student id provided');
        }

        const student = await window.beaconingAPI.getStudent(this.props.id);

        if (student) {
            this.state.student = student;

            return;
        }

        throw new Error('[Student Edit] student not found!');
    }

    async updateStudent(studentButton: EventTarget) {
        const { student } = this.state;

        const obj = {
            id: student.id,
            username: this.state.studentUsername === '' ? student.username : this.state.studentUsername,
            email: this.state.studentEmail === '' ? null : this.state.studentEmail,
            profile: {
                firstName: this.state.studentFirstName === '' ? student.profile.firstName : this.state.studentFirstName,
                lastName: this.state.studentLastName === '' ? student.profile.lastName : this.state.studentLastName,
                DOB: this.state.studentDOB === '' ? student.profile.DOB : this.state.studentDOB,
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
                message: 'student updated',
            });

            this.appendView(statusMessageEl);

            const doneButton = document.getElementById('edit-student-done');

            studentButton.textContent = 'Update Student';
            doneButton.textContent = 'Done';

            this.emit('StudentNameUpdate');

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: 'student not updated!',
        });

        studentButton.textContent = 'Update Student';

        this.appendView(statusMessageEl);
    }

    async render() {
        const { student } = this.state;

        return div(
            '.flex-column',
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p('Edit Student information:'),
                    ),
                    form(
                        '.create-student',
                        label(
                            span('Student Username'),
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
                            span('Student First Name'),
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
                            span('Student Last Name'),
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
                            span('Student Date of Birth'),
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
                            span('Student Email'),
                            input(
                                '#student-email.text-field',
                                {
                                    type: 'email',
                                    placeholder: 'Enter New Email (or leave blank)',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.studentEmail = target.value;
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
                                    'Cancel',
                                ),
                                div(
                                    '#update-student-button.button-action',
                                    {
                                        onclick: (event) => {
                                            const { target } = event;
                                            this.updateStudent(target);

                                            target.textContent = 'Updating...';
                                        },
                                    },
                                    'Update Student',
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
