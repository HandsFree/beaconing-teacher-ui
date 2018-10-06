// @flow
import {
    section,
    div,
    form,
    p,
    input,
    label,
    span,
} from '../../../../core/html';

import Form from '../../../form';
import Status from '../../../status';
import StudentsList from './students_list';

class StudentEdit extends Form {
    stateObj = {
        groupName: '',
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

    group = {};

    groups = [];

    studentList: Array<Object> = [];

    updateHooks = {
        StudentSelected: this.updateStudentList,
    };

    processGroups(groupsArr: Object[]) {
        for (const obj of groupsArr) {
            this.groups.push(obj?.name.toLowerCase());
        }
    }

    async init() {
        if (!this.props.id) {
            throw new Error('[Group Edit] no group id provided');
        }

        const group = await window.beaconingAPI.getGroup(this.props.id);
        const groups = await window.beaconingAPI.getGroups();

        if (group && groups) {
            this.group = group;
            this.studentList = group?.students ?? [];

            this.state = {
                groupName: group?.name ?? '',
            };

            this.processGroups(groups);

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
            groupButton.textContent = await window.bcnI18n.getPhrase('cr_group_update');
            doneButton.textContent = await window.bcnI18n.getPhrase('done');

            return;
        }

        groupButton.textContent = await window.bcnI18n.getPhrase('cr_group_update');
        doneButton.textContent = await window.bcnI18n.getPhrase('cancel');
    }

    async checkGroupName() {
        if (this.state.groupName === '') {
            this.removeAll('group-name-status');

            return true;
        }

        if (this.state.groupName !== this.group.name && this.groups.indexOf(this.state.groupName.toLowerCase()) !== -1) {
            const errMsg = await window.bcnI18n.getPhrase('group_name_exists');
            this.addError('group-name-status', errMsg);

            return false;
        }

        this.addSuccess('group-name-status');
        return true;
    }

    async checkFields() {
        let success = true;
        const emptyMsg = await window.bcnI18n.getPhrase('required_empty');

        if (this.state.groupName === '') {
            this.addError('group-name-status', emptyMsg);
            success = false;
        }

        if (!this.checkGroupName()) {
            success = false;
        }

        if (this.studentList.length < 2) {
            this.addError('group-students-status', await window.bcnI18n.getPhrase('more_students_needed'));
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

            this.changeButtons(false);

            return false;
        }

        return true;
    }

    async updateGroup() {
        if (await this.checkFields() === false) {
            return;
        }

        // console.log(this.state.groupCategory);

        const obj = {
            id: this.group.id,
            name: this.state.groupName,
            students: this.studentList.length >= 2 ? this.studentList : this.group.students,
        };

        // console.log('Group Obj: ', obj);

        const status = await window.beaconingAPI.updateGroup(this.group.id, obj);
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
        const studentsArr = [];

        for (const obj of this.group.students) {
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
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.bcnI18n.getPhrase('cr_group_name'))),
                                div('.desc-area', await window.bcnI18n.getPhrase('cr_group_name_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#group-name.text-field',
                                            {
                                                type: 'text',
                                                placeholder: await window.bcnI18n.getPhrase('cr_group_enter_name'),
                                                value: this.state.groupName,
                                                oninput: (event) => {
                                                    const { target } = event;

                                                    this.state.groupName = target.value;
                                                    this.addLoading('group-name-status');
                                                    this.checkGroupName();
                                                },
                                                required: true,
                                            },
                                        ),
                                    ),
                                ),
                                div('#group-name-status.status-area'),
                            ),
                        ),
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.bcnI18n.getPhrase('students'))),
                                div('.desc-area', await window.bcnI18n.getPhrase('cr_students_group_desc')),
                                div(
                                    '.input-area',
                                    studentsListEl,
                                ),
                                div('#group-students-status.status-area'),
                            ),
                        ),
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
                                '#update-group-button.button-submit',
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
