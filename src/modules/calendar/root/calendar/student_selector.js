// @flow
import {
    a,
    section,
    p,
    div,
    h3,
    input,
} from '../../../../core/html';

import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import nullishCheck from '../../../../core/util';

class CalendarSelectedGroup extends Component {
    clicked() {
        const { id, name } = this.props;

        // don't do anything if we've already selected
        // this group
        if (window.sessionStorage.getItem('calendarSelectionType') === 'groups') {
            const data = nullishCheck(window.sessionStorage.getItem('calendarSelection'), 'none');
            if (data !== 'none') {
                const groupData = JSON.parse(data);
                if (groupData.group !== null && groupData.group.id === id) {
                    return;
                }
            }
        }

        window.sessionStorage.setItem('calendarSelection', JSON.stringify({
            student: null,
            group: {
                id,
                name,
            },
        }));

        this.emit('RefreshCalendarController');
        this.emit('RefreshCalendarView');

        // scroll up!
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async render() {
        const {
            name,
        } = this.props;

        const card = div(
            '.small-box',
            div(
                '.title',
                p(
                    '.item-name',
                    `${name}`,
                ),
            ),
        );
        return a(
            '.clickable-box-link',
            {
                onclick: () => this.clicked(),
            },
            card,
        );
    }
}

class CalendarSelectedStudent extends Component {
    clicked() {
        const { id, username } = this.props;
        
        // don't do anything if we've already selected
        // this group
        if (window.sessionStorage.getItem('calendarSelectionType') === 'students') {
            const data = nullishCheck(window.sessionStorage.getItem('calendarSelection'), 'none');
            if (data !== 'none') {
                const studentData = JSON.parse(data);
                if (studentData.student !== null && studentData.student.id === id) {
                    return;
                }
            }
        }

        window.sessionStorage.setItem('calendarSelection', JSON.stringify({
            student: {
                id,
                username,
            },
            group: null,
        }));
        this.emit('RefreshCalendarController');
        this.emit('RefreshCalendarView');

        // scroll up!
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async render() {
        const {
            username,
            fullName,
        } = this.props;

        const card = div(
            '.small-box',
            div(
                '.title.flex-column',
                // the user might not have their
                // full name registered, but they
                // definitely have a username.
                fullName ? h3(
                    fullName,
                ) : [],

                p(
                    '.item-name',
                    `${username}`,
                ),
            ),
        );
        return a(
            '.clickable-box-link',
            {
                onclick: () => this.clicked(),
            },
            card,
        );
    }
}

class StudentList extends Component {
    updateHooks = {
        'FilterStudentList': this.filterStudentList,
    };

    async init() {
        const studentsSet = await window.beaconingAPI.getStudents();
        this.state = {
            studentsSet: studentsSet,
            selected: studentsSet,
        };
    }

    filterStudentList(event: CustomEvent) {
        const { detail } = event;
        
        const { value } = detail.target;


        let selected = [];

        const query = value.toLowerCase();
        for (const student of this.state.studentsSet) {
            const { username } = student;
            if (username.toLowerCase().indexOf(query) != -1) {
                selected.push(student);
            }
        }

        this.state.selected = selected;
        this.reloadAndRender();
    }

    async reloadAndRender() {
        const selItemsProm = [];
        const { selected } = this.state;

        const numItemsToShow = 10;

        for (const student of selected.slice(0, numItemsToShow)) {
            const selItem = new CalendarSelectedStudent();
            
            let fullName;
            if (student.profile) {
                const { firstName, lastName } = student.profile;
                fullName = `${firstName} ${lastName}`;
            }
            
            const selItemEl = selItem.attach({
                id: student.id,
                username: student.username,
                fullName: fullName,
            });
            selItemsProm.push(selItemEl);
        }

        const studentsEl = await Promise.all(selItemsProm).then(elements => elements);
        this.updateView(
            div(
                '.calendar-students-list',
                studentsEl,
            )
        );
    }

    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach({
            msg: await window.beaconingAPI.getPhrase('ld_students'),
        });

        return div(loadingEl);
    }

    async afterMount() {
        // this is kindy of hacky but the rendering
        // is delegated to the following function so
        // it can be invoked when the updatehook is called.
        this.reloadAndRender();
    }
}

class StudentSelector extends Component {
    async render() {
        const studentsList = new StudentList();
        const studentsListEl = await studentsList.attach();

        return section(
            '.flex-column',

            input(
                '.calendar-student-filter-box',
                {
                    type: 'text',
                    placeholder: 'Filter by student name',
                    onkeyup: (event) => {
                        this.emit('FilterStudentList', event);
                    },
                },
            ),
            studentsListEl,
        );
    }
}

class GroupList extends Component {
    updateHooks = {
        'FilterGroupList': this.filterGroupList,
    };

    async init() {
        const groupSet = await window.beaconingAPI.getGroups();
        this.state = {
            groupSet: groupSet,
            selected: groupSet,
        };
    }

    filterGroupList(event: CustomEvent) {
        const { detail } = event;
        
        const { value } = detail.target;

        let selected = [];

        const query = value.toLowerCase();
        for (const group of this.state.groupSet) {
            const { name } = group;
            if (name.toLowerCase().indexOf(query) != -1) {
                selected.push(group);
            }
        }

        this.state.selected = selected;
        this.reloadAndRender();
    }
    
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach({
            msg: await window.beaconingAPI.getPhrase('ld_groups'),
        });

        return section(
            '.flex-column',
            loadingEl,
        );
    }

    async reloadAndRender() {
        const selItemsProm = [];
        
        const numItemsToShow = 10;

        const { selected } = this.state;
        for (const group of selected.slice(0, numItemsToShow)) {
            const selItem = new CalendarSelectedGroup();
            const selItemEl = selItem.attach({
                id: group.id,
                name: group.name,
            });
            selItemsProm.push(selItemEl);
        }

        const groupsEl = await Promise.all(selItemsProm).then(elements => elements);
        this.updateView(
            div(
                '.calendar-groups-list',
                groupsEl,
            )
        );
    }

    async afterMount() {
        this.reloadAndRender();
    }
}

class GroupSelector extends Component {
    async render() {
        const groupList = new GroupList();
        const groupListEl = await groupList.attach();

        return section(
            '.flex-column',

            input(
                '.calendar-student-filter-box',
                {
                    type: 'text',
                    placeholder: 'Filter by group name',
                    onkeyup: (event) => {
                        this.emit('FilterGroupList', event);
                    },
                },
            ),
            groupListEl,
        );
    }
}

class SelectorPanel extends Component {
    updateHooks = {
        RefreshPanel: this.refreshPanel,
    };

    async refreshPanel() {
        this.updateView(await this.render());
    }

    async render() {
        const selType = window.sessionStorage.getItem('calendarSelectionType');
        switch (selType) {
            case 'students': {
                const studentsEl = await new StudentSelector().attach();
                return section('.full-width', studentsEl);
            }
            case 'groups': {
                const groupEl = await new GroupSelector().attach();
                return section('.full-width', groupEl);
            }
            default: {
                return section('.full-width');
            }
        }
    }
}

export default SelectorPanel;
