// @flow
import { section, div, a, i, h1, form, input, select, option, p, label, span, small } from '../../../../core/html';

import { Component } from '../../../../core/component';
import StudentsList from './students_list';
import Status from '../../../status';

class GroupForm extends Component {
    studentList: Array<Object> = [];

    updateHooks = {
        StudentSelected: this.updateStudentList,
    };

    state = {
        groupName: '',
        groupCategory: 'normal',
    };

    updateStudentList() {
        const studentListEl = document.getElementById('student-list');
        const checkedEls = studentListEl.querySelectorAll('input[type="checkbox"]:checked');

        this.studentList = [];

        for (const el of checkedEls) {
            this.studentList.push({
                id: parseInt(el.value, 10),
            });
        }
    }

    async createGroup() {
        const obj = {
            name: this.state.groupName,
            category: this.state.groupCategory,
            students: this.studentList,
        };

        // console.log(obj);

        const status = await window.beaconingAPI.addGroup(obj);
        const statusMessage = new Status();

        console.log('[Create Group] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: `group '${this.state.groupName}' created`,
            });

            this.appendView(statusMessageEl);

            const groupButton = document.getElementById('create-group-button');

            groupButton.textContent = 'Create Group';

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: 'group not created!',
        });

        const groupButton = document.getElementById('create-group-button');

        groupButton.textContent = 'Create Group';

        this.appendView(statusMessageEl);
    }

    async render() {
        const studentsList = new StudentsList();

        const studentsListEl = await studentsList.attach();

        return div(
            '.flex-column',
            section(
                '.flex-column',
                div(
                    '#section-header',
                    a(
                        '.back',
                        {
                            href: `//${window.location.host}/classroom/groups`,
                        },
                        i('.icon-angle-left'),
                        'Go Back',
                    ),
                    h1('Create Group'),
                    div('.empty-spacer', ' '),
                ),
            ),
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p('Enter Group information:'),
                    ),
                    form(
                        '.create-group',
                        label(
                            span('Group Name'),
                            input(
                                '#group-name.text-field',
                                {
                                    type: 'text',
                                    placeholder: 'Enter Name',
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.groupName = target.value;
                                    },
                                },
                            ),
                        ),
                        label(
                            '.select',
                            span('Group Category'),
                            select(
                                '#group-category',
                                {
                                    onchange: (event) => {
                                        const { target } = event;

                                        this.state.groupCategory = target.value;
                                    },
                                },
                                option({ value: 'normal' }, 'Normal'),
                                option({ value: 'class' }, 'Class'),
                                option({ value: 'course' }, 'Course'),
                            ),
                        ),
                        small('Students'),
                        studentsListEl,
                        div(
                            '.flex-justify-end.margin-top-10',
                            div(
                                '#create-group-button.button-action',
                                {
                                    onclick: (event) => {
                                        const { target } = event;
                                        this.createGroup();

                                        target.textContent = 'Creating...';
                                    },
                                },
                                'Create Group',
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default GroupForm;
