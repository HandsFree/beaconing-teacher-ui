// @flow
import { a, section, p, div } from '../../../../core/html';
import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import nullishCheck from '../../../../core/util';

class CalendarSelectedGroup extends Component {
    async render() {
        const {
            id,
            name,
        } = this.props;

        return div('.cal-sel-item',
            p('.item-name', `${name}`),
            p(a('.fake-link',
                {
                    onclick: () => {
                        // don't do anything if we've already selected
                        // this group
                        if (window.sessionStorage.getItem('calendarSelectionType') === 'groups') {
                            const data = nullishCheck(window.sessionStorage.getItem('calendarSelection'), 'none');
                            if (data !== 'none') {
                                const groupData = JSON.parse(data);
                                if (groupData.group.id === id) {
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
                    },
                },
                'View',
            )),
        );
    }
}

class CalendarSelectedStudent extends Component {
    async render() {
        const {
            id,
            username,
        } = this.props;

        return div('.cal-sel-item',
            p('.item-name', `${username}`),
            p(a('.fake-link',
                {
                    onclick: () => {
                        // don't do anything if we've already selected
                        // this group
                        if (window.sessionStorage.getItem('calendarSelectionType') === 'students') {
                            const data = nullishCheck(window.sessionStorage.getItem('calendarSelection'), 'none');
                            if (data !== 'none') {
                                const studentData = JSON.parse(data);
                                if (studentData.student.id === id) {
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
                    },
                },
                'View',
            )),
        );
    }
}

class StudentSelector extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return section(
            '.flex-column',
            loadingEl,
        );
    }

    async afterMount() {
        const studentsSet = await window.beaconingAPI.getStudents();
        const selItemsProm = [];

        for (const student of studentsSet) {
            const selItem = new CalendarSelectedStudent();
            console.log(student);
            const selItemEl = selItem.attach({
                id: student.id,
                username: student.username,
            });

            selItemsProm.push(selItemEl);
        }

        const studentsEl = await Promise.all(selItemsProm).then(elements => elements);
        this.updateView(studentsEl);
    }
}

class GroupSelector extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach();

        return section(
            '.flex-column',
            loadingEl,
        );
    }

    async afterMount() {
        const groupSet = await window.beaconingAPI.getGroups();
        const selItemsProm = [];

        for (const group of groupSet) {
            const selItem = new CalendarSelectedGroup();
            const selItemEl = selItem.attach({
                id: group.id,
                name: group.name,
            });

            selItemsProm.push(selItemEl);
        }

        const groupsEl = await Promise.all(selItemsProm).then(elements => elements);
        this.updateView(groupsEl);
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
        case 'students':
            const studentsEl = await new StudentSelector().attach();
            return section('.full-width', studentsEl);
        case 'groups':
            const groupEl = await new GroupSelector().attach();
            return section('.full-width', groupEl);
        default:
            return section('.full-width');
        }
    }
}

export default SelectorPanel;
