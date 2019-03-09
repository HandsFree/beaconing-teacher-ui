// @flow
import {
    section,
    div,
    form,
    input,
    p,
    label,
    span,
} from '../../../../core/html';

import Form from '../../../form';
import StudentsList from './students_list';
import Status from '../../../status';
import PostCreation from './post_creation';

class GroupForm extends Form {
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

    groups = [];

    studentList: Array<Object> = [];

    updateHooks = {
        StudentSelected: this.updateStudentList,
        ResetForm: this.resetForm,
    };

    processGroups(groupsArr: Object[]) {
        for (const obj of groupsArr) {
            this.groups.push(obj?.name.toLowerCase());
        }
    }

    async init() {
        const groups = await window.beaconingAPI.getGroups();

        if (groups) {
            this.processGroups(groups);
        }
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

    async resetForm() {
        this.state = {
            groupName: '',
            groupCategory: 'normal',
        };

        this.updateView(await this.render());
    }

    async resetSubmit() {
        const groupButton = document.getElementById('create-group-button');
        groupButton.textContent = await window.beaconingAPI.getPhrase('cr_create_group');
    }

    async checkGroupName() {
        if (this.state.groupName === '') {
            this.removeAll('group-name-status');

            return true;
        }

        if (this.groups.indexOf(this.state.groupName.toLowerCase()) !== -1) {
            const errMsg = await window.beaconingAPI.getPhrase('err_group_name_exists');
            this.addError('group-name-status', errMsg);

            return false;
        }

        this.addSuccess('group-name-status');
        return true;
    }

    async checkFields() {
        let success = true;
        const emptyMsg = await window.beaconingAPI.getPhrase('err_required_empty');

        if (this.state.groupName === '') {
            this.addError('group-name-status', emptyMsg);
            success = false;
        }

        if (!this.checkGroupName()) {
            success = false;
        }

        if (this.studentList.length < 2) {
            this.addError('group-students-status', await window.beaconingAPI.getPhrase('err_more_students_needed'));
            success = false;
        }

        if (!success) {
            const statusMessage = new Status();
            const statusMessageEl = await statusMessage.attach({
                elementID: false,
                heading: 'Error',
                type: 'error',
                message: await window.beaconingAPI.getPhrase('err_form'),
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
            students: this.studentList,
        };

        // console.log(obj);

        const status = await window.beaconingAPI.addGroup(obj);
        const statusMessage = new Status();

        console.log('[Create Group] status:', status ? 'success!' : 'failed!');

        // const status = false;

        if (status) {
            this.resetSubmit();
            this.afterCreation(status);

            return;
        }

        const statusMessageEl = await statusMessage.attach({
            elementID: false,
            heading: 'Error',
            type: 'error',
            message: await window.beaconingAPI.getPhrase('err_group_nc'),
        });

        this.appendView(statusMessageEl);

        this.resetSubmit();
    }

    async afterCreation(group: Object) {
        const pcEL = new PostCreation().attach({
            title: await window.beaconingAPI.getPhrase('sc_group_cre'),
            id: group.id,
        });

        this.updateView(await pcEL);
    }

    async render() {
        const studentsList = new StudentsList();

        const studentsListEl = await studentsList.attach();

        const creatingText = await window.beaconingAPI.getPhrase('creating');

        return div(
            '.flex-column',
            section(
                '.flex-column',
                div(
                    '.margin-25.flex-column',
                    div(
                        '.general-info',
                        p(`${await window.beaconingAPI.getPhrase('cr_group_edit_info')}:`),
                    ),
                    form(
                        '.create-group',
                        div(
                            '.label-group',
                            div(
                                '.split',
                                div('.title-area', span(await window.beaconingAPI.getPhrase('cr_group_name'))),
                                div('.desc-area', await window.beaconingAPI.getPhrase('cr_group_name_desc')),
                                div(
                                    '.input-area',
                                    label(
                                        '.required',
                                        input(
                                            '#group-name.text-field',
                                            {
                                                type: 'text',
                                                placeholder: await window.beaconingAPI.getPhrase('cr_group_enter_name'),
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
                                div('.title-area', span(await window.beaconingAPI.getPhrase('cr_students'))),
                                div('.desc-area', await window.beaconingAPI.getPhrase('cr_students_group_desc')),
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
                                '#create-group-cancel.button-passive',
                                {
                                    onclick: () => {
                                        this.resetForm();
                                        window.location.href = `//${window.location.host}/classroom/groups`;
                                    },
                                },
                                await window.beaconingAPI.getPhrase('cancel'),
                            ),
                            div(
                                '#create-group-button.button-submit',
                                {
                                    onclick: (event) => {
                                        const { target } = event;
                                        this.createGroup();

                                        target.textContent = `${creatingText}...`;
                                    },
                                },
                                await window.beaconingAPI.getPhrase('cr_create_group'),
                            ),
                        ),
                    ),
                ),
            ),
        );
    }
}

export default GroupForm;
