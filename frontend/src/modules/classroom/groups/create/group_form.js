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

    async resetSubmit() {
        const groupButton = document.getElementById('create-group-button');
        groupButton.textContent = await window.bcnI18n.getPhrase('cr_create_group');
    }

    async checkFields() {
        // TODO: reduce duped code
        if (this.state.groupName === '') {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: 'group-name',
                heading: 'Error',
                type: 'error',
                message: (await window.bcnI18n.getPhrase('empty_field')).replace('%s', `'${await window.bcnI18n.getPhrase('cr_group_name')}'`),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        if (this.studentList.length < 2) {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Error',
                type: 'error',
                message: await window.bcnI18n.getPhrase('more_students_needed'),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return false;
        }

        return true;
    }

    async createGroup() {
        if (await this.checkFields() === false) {
            return;
        }

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
                message: (await window.bcnI18n.getPhrase('group_created')).replace('%s', this.state.groupName),
            });

            this.appendView(statusMessageEl);

            this.resetSubmit();

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('group_nc'),
        });

        this.appendView(statusMessageEl);

        this.resetSubmit();
    }

    async render() {
        const studentsList = new StudentsList();

        const studentsListEl = await studentsList.attach();

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
                            href: `//${window.location.host}/classroom/groups`,
                        },
                        i('.icon-angle-left'),
                        await window.bcnI18n.getPhrase('go_back'),
                    ),
                    h1(await window.bcnI18n.getPhrase('cr_create_group')),
                    div('.empty-spacer', ' '),
                ),
            ),
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p(`${await window.bcnI18n.getPhrase('cr_group_info')}:`),
                    ),
                    form(
                        '.create-group',
                        label(
                            span(await window.bcnI18n.getPhrase('cr_group_name')),
                            input(
                                '#group-name.text-field',
                                {
                                    type: 'text',
                                    placeholder: await window.bcnI18n.getPhrase('cr_group_enter_name'),
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.groupName = target.value;
                                    },
                                    required: true,
                                },
                            ),
                        ),
                        label(
                            '.select',
                            span(await window.bcnI18n.getPhrase('cr_group_category')),
                            select(
                                '#group-category',
                                {
                                    onchange: (event) => {
                                        const { target } = event;

                                        this.state.groupCategory = target.value;
                                    },
                                },
                                option({ value: 'normal' }, await window.bcnI18n.getPhrase('normal')),
                                option({ value: 'class' }, await window.bcnI18n.getPhrase('class')),
                                option({ value: 'course' }, await window.bcnI18n.getPhrase('course')),
                            ),
                        ),
                        small(await window.bcnI18n.getPhrase('students')),
                        studentsListEl,
                        div(
                            '.flex-justify-end.margin-top-10',
                            div(
                                '#create-group-button.button-action',
                                {
                                    onclick: (event) => {
                                        const { target } = event;
                                        this.createGroup();

                                        target.textContent = `${creatingText}...`;
                                    },
                                },
                                await window.bcnI18n.getPhrase('cr_create_group'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default GroupForm;
