// @flow
import { section, div, form, p, input, label, span, select, option, small } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Status from '../../../status';
import StudentsList from './students_list';
import nullishCheck from '../../../../core/util';

class StudentEdit extends Component {
    state = {
        group: {},
        groupName: '',
        groupCategory: '',
    };

    studentList: Array<Object> = [];

    updateHooks = {
        StudentSelected: this.updateStudentList,
    };

    async init() {
        if (!this.props.id) {
            throw new Error('[Group Edit] no group id provided');
        }

        const group = await window.beaconingAPI.getGroup(this.props.id);

        if (group) {
            this.state.group = group;

            this.state.groupName = nullishCheck(group?.name, '');
            this.state.groupCategory = nullishCheck(group?.category, '');
            this.state.studentList = nullishCheck(group?.students, []);

            return;
        }

        throw new Error('[Group Edit] group not found!');
    }

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

    async changeButtons(completed: boolean) {
        const doneButton = document.getElementById('edit-group-done');
        const groupButton = document.getElementById('update-group-button');

        if (completed) {
            groupButton.textContent = await window.bcnI18n.getPhrase('cr_update_group');
            doneButton.textContent = await window.bcnI18n.getPhrase('done');

            return;
        }

        groupButton.textContent = await window.bcnI18n.getPhrase('cr_create_group');
        doneButton.textContent = await window.bcnI18n.getPhrase('cancel');
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

            this.changeButtons(false);

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

            this.changeButtons(false);

            return false;
        }

        return true;
    }

    async updateGroup() {
        if (await this.checkFields() === false) {
            return;
        }

        const { group } = this.state;

        // console.log(this.state.groupCategory);

        const obj = {
            id: group.id,
            name: this.state.groupName === '' ? group.name : this.state.groupName,
            category: this.state.groupCategory === '' ? group.category : this.state.groupCategory,
            students: this.studentList.length >= 2 ? this.studentList : group.students,
        };

        // console.log('Group Obj: ', obj);

        const status = await window.beaconingAPI.updateGroup(group.id, obj);
        const statusMessage = new Status();

        console.log('[Update Group] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Success',
                type: 'success',
                message: await window.bcnI18n.getPhrase('group_up'),
            });

            this.appendView(statusMessageEl);

            this.changeButtons(true);

            this.emit('GroupNameUpdate', {
                groupName: this.state.groupName,
                groupCategory: this.state.groupCategory,
            });

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.bcnI18n.getPhrase('group_nu'),
        });

        this.changeButtons(false);

        this.appendView(statusMessageEl);
    }

    async render() {
        const { group } = this.state;

        const studentsArr = [];

        for (const obj of group.students) {
            studentsArr.push(obj.id);
        }

        const studentsList = new StudentsList();

        const studentsListEl = await studentsList.attach({
            groupStudents: studentsArr,
        });

        const updatingText = await window.bcnI18n.getPhrase('updating');

        return div(
            '.flex-column',
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p(`${await window.bcnI18n.getPhrase('cr_group_edit_info')}:`),
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
                                    value: group.name,
                                    oninput: (event) => {
                                        const { target } = event;

                                        this.state.groupName = target.value;
                                    },
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
                                option(
                                    {
                                        value: 'normal',
                                        selected: group.category === 'normal',
                                    },
                                    'Normal',
                                ),
                                option(
                                    {
                                        value: 'class',
                                        selected: group.category === 'class',
                                    },
                                    await window.bcnI18n.getPhrase('class'),
                                ),
                                option(
                                    {
                                        value: 'course',
                                        selected: group.category === 'course',
                                    },
                                    'Course',
                                ),
                            ),
                        ),
                        small(await window.bcnI18n.getPhrase('students')),
                        studentsListEl,
                        div(
                            '.flex-justify-end.margin-top-10',
                            div(
                                '#edit-group-done.button-passive',
                                {
                                    onclick: () => {
                                        this.emit('EditDoneClicked');
                                    },
                                },
                                await window.bcnI18n.getPhrase('cancel'),
                            ),
                            div(
                                '#update-group-button.button-action',
                                {
                                    onclick: (event) => {
                                        const { target } = event;
                                        this.updateGroup();

                                        target.textContent = `${updatingText}...`;
                                    },
                                },
                                await window.bcnI18n.getPhrase('cr_group_update'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default StudentEdit;
