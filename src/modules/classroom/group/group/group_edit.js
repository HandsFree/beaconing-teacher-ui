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

        this.state.trans = await window.beaconingAPI.getPhrases(
            'cr_group_update',
            'done',
            'cr_group_update',
            'cancel',
            'err_group_name_exists',
            'err_required_empty',
            'err_more_students_needed',
            'err_form',
            'sc_group_up',
            'err_group_nu',
            'updating',
            'cr_group_edit_info',
            'cr_group_name',
            'cr_group_name_desc',
            'cr_group_enter_name',
            'cr_students',
            'cr_students_group_desc',
            'cancel',
            'cr_group_update',
        );

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
            groupButton.textContent = this.state.trans.get('cr_group_update');
            doneButton.textContent = this.state.trans.get('done');

            return;
        }

        groupButton.textContent = this.state.trans.get('cr_group_update');
        doneButton.textContent = this.state.trans.get('cancel');
    }

    async checkGroupName() {
        if (this.state.groupName === '') {
            this.removeAll('group-name-status');

            return true;
        }

        if (this.state.groupName !== this.group.name && this.groups.indexOf(this.state.groupName.toLowerCase()) !== -1) {
            const errMsg = this.state.trans.get('err_group_name_exists');
            this.addError('group-name-status', errMsg);

            return false;
        }

        this.addSuccess('group-name-status');
        return true;
    }

    async checkFields() {
        let success = true;
        const emptyMsg = this.state.trans.get('err_required_empty');

        if (this.state.groupName === '') {
            this.addError('group-name-status', emptyMsg);
            success = false;
        }

        if (!this.checkGroupName()) {
            success = false;
        }

        if (this.studentList.length < 2) {
            this.addError('group-students-status', this.state.trans.get('err_more_students_needed'));
            success = false;
        }

        if (!success) {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Error',
                type: 'error',
                message: this.state.trans.get('err_form'),
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
                message: this.state.trans.get('sc_group_up'),
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
            message: this.state.trans.get('err_group_nu'),
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

        const updatingText = this.state.trans.get('updating');

        return div(
            '.flex-column',
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p(`${this.state.trans.get('cr_group_edit_info')}:`),
                    ),
                    form(
                        '.create-group',
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(this.state.trans.get('cr_group_name'))),
                                div('.desc-area', this.state.trans.get('cr_group_name_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#group-name.text-field',
                                            {
                                                type: 'text',
                                                placeholder: this.state.trans.get('cr_group_enter_name'),
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
                                div('.title-area', span(this.state.trans.get('cr_students'))),
                                div('.desc-area', this.state.trans.get('cr_students_group_desc')),
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
                                this.state.trans.get('cancel'),
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
                                this.state.trans.get('cr_group_update'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default StudentEdit;
