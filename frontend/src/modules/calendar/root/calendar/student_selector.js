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

        return div('.small-box',
            div(
                '.title',
                p('.item-name.fake-link', a(
                    {
                        title: await window.beaconingAPI.getPhrase('cal_view_in_classroom'),
                        href: `//${window.location.host}/classroom/group?id=${id}`,
                    },
                    `${name}`,
                )),
            ),
            div(
                '.box-buttons',
                p(a(
                    '.fake-link',
                    {
                        onclick: () => {
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
                        },
                    },
                    await window.beaconingAPI.getPhrase('view'),
                )),
            ),
        );
    }
}

class CalendarSelectedStudent extends Component {
    clicked() {
        console.log('doing the clicky business');
        
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
    }

    async render() {
        const {
            username,
        } = this.props;

        const card = div(
            '.small-box',
            div(
                '.title',
                p(
                    '.item-name',
                    `${username}`,
                ),
            ),
        );
        return a(
            '.fake-link',
            {
                onclick: () => this.clicked(),
            },
            card,
        );
    }
}

class StudentSelector extends Component {
    async render() {
        const loading = new Loading();

        const loadingEl = await loading.attach({
            msg: await window.beaconingAPI.getPhrase('ld_students'),
        });

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

        const loadingEl = await loading.attach({
            msg: await window.beaconingAPI.getPhrase('ld_groups'),
        });

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
