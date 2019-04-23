// @flow
import { div, input, nav, h4, a } from '../../../core/html';

import { Component } from '../../../core/component';
import StudentBox from './student_box';
import GroupBox from './group_box';

class TabControlPane extends Component {
    updateHooks = {
        RefreshGroups: this.refreshGroups,
        RefreshStudents: this.refreshStudents,
        ProcAssignSearch: this.procAssignSearch,
    };

    async procAssignSearch(event: CustomEvent) {
        const { detail } = event;
        const handle = this.selectionType === 'students' ? 'RefreshStudents' : 'RefreshGroups';
        this.emit(handle, detail);
    }

    async init() {
        this.selectionType = 'students';
    }

    async refreshGroups() {
        this.selectionType = 'groups';
        this.updateView(await this.render());
    }

    async refreshStudents() {
        this.selectionType = 'students';
        this.updateView(await this.render());
    }
    
    async render() {
        return nav('#assign-tabs',
            div(
                '.tab-container',
                a(
                    `.tab ${this.selectionType == 'students' ? '.active' : ''}`, 
                    {
                        onclick: (evt) => {
                            this.emit('RefreshStudents');
                            this.emit('ClearAssignSearchBar');
                        },
                    },
                    `${await window.beaconingAPI.getPhrase('cr_students')}`
                ),
                a(
                    `.tab ${this.selectionType == 'groups' ? '.active' : ''}`, 
                    {
                        onclick: () => {
                            this.emit('RefreshGroups');
                            this.emit('ClearAssignSearchBar');
                        },
                    },
                    `${await window.beaconingAPI.getPhrase('cr_groups')}`
                ),
            ),
        );
    }
}

class TabView extends Component {
    state = {};
    updateHooks = {
        RefreshGroups: this.refreshGroups,
        RefreshStudents: this.refreshStudents,
    };

    async init() {
        const students = await window.beaconingAPI.getStudents();
        const groups = await window.beaconingAPI.getGroups();

        this.state = {
            students: students,
            groups: groups,
        };
    }

    async refreshGroups(event: CustomEvent) {
        const { detail } = event;
        this.state.query = detail;
        this.updateView(await this.renderGroups());
    }

    async refreshStudents(event: CustomEvent) {
        const { detail } = event;
        this.state.query = detail;
        this.updateView(await this.renderStudents());
    }
    
    async afterMount() {
        this.updateView(await this.renderStudents());
    }

    async renderGroups() {
        const { groups } = this.state;
        if (!groups) {
            // FIXME
            return h4('failed');
        }

        let selected = [];

        const { query } = this.state;
        if (query) {
            for (const group of groups) {
                console.log('ze group', group);
                if (group.name.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                    selected.push(group);
                }
            }
        } else {
            // show all the groups
            selected = groups;
        }

        const groupsProm = [];
        for (const group of selected) {
            const groupBox = new GroupBox();
            const groupBoxEl = groupBox.attach({
                group,
                glpID: this.props.id,
            });

            groupsProm.push(groupBoxEl);
        }

        const groupsEl = await Promise.all(groupsProm).then(elements => elements);

        return div(
            '.groups-container',
            groupsEl,
        );
    }

    async renderStudents() {
        const { students } = this.state;
        if (!students) {
            // FIXME
            return h4('failed');
        }

        const studentsProm = [];

        let selected = [];

        const { query } = this.state;
        if (query) {
            for (const student of students) {
                if (student.username.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
                    selected.push(student);
                }
            }
        } else {
            // show all the groups
            selected = students;
        }

        const usernameTrans = await window.beaconingAPI.getPhrase('username');
        for (const student of selected) {
            const studentBox = new StudentBox();
            const studentBoxEl = studentBox.attach({
                student,
                glpID: this.props.id,
                usernameTrans,
            });

            studentsProm.push(studentBoxEl);
        }
        const studentsEl = await Promise.all(studentsProm).then(elements => elements);

        return div(
            '.students-container',
            studentsEl,
        );
    }

    async render() {
        return div(
            '.groups-container',
        );
    }
}

class AssignSearchBar extends Component {
    updateHooks = {
        ClearAssignSearchBar: this.clearSearchBar,
    };

    async init() {
        this.state.value = '';
    }

    async clearSearchBar() {
        this.state.value = '';
        this.updateView(await this.render());
    }
    
    async render() {
        return div('.flex-column',
            input(
                '.filter-assign',
                {
                    type: 'text',
                    placeholder: 'Filter assign options',
                    value: this.state.value,
                    onkeyup: (event) => {
                        this.emit('ProcAssignSearch', event.target.value ?? '');
                    },
                }
            ),
        );
    }
}

class AssignOptions extends Component {
    async init() {
        if (!this.props.id) {
            // console.log(this.props);
            throw new Error('[Assign Options] GLP ID not provided');
        }
    }

    async render() {
        const { id } = this.props.id;

        const tabControl = new TabControlPane();
        const tabView = new TabView();
        const searchBar = new AssignSearchBar();

        return Promise.all([
            tabControl.attach(),
            tabView.attach(),
            searchBar.attach(),
        ]).then((values) => {
            const [
                tabControlEl,
                tabViewEl,
                searchBarEl,
            ] = values;

            return div(
                '#assign-options',
                searchBarEl,
                tabControlEl,
                div('.margin-top-20',
                    tabViewEl,
                ),
            );
        });
    }
}

export default AssignOptions;
