// @flow
import { label, section, h2, p, div, ul, li, span, select, option } from '../../../../core/html';
import { Component } from '../../../../core/component';
import Loading from '../../../loading';
import nullishCheck from '../../../../core/util';

class CalendarSelectionItem extends Component {
    async render() {
        const {
            name,
        } = this.props;

        return div('.cal-sel-item', 
            p('.item-name', {
                onclick: () => {
                    // do selection thingy!
                    alert(`selected group ${name}`);
                },
            }, `${name}`)
        );
    }
}

class StudentSelector extends Component {
    async render() {
        return div(
            h2('Students:')
        );
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
            const selItem = new CalendarSelectionItem();
            const selItemEl = selItem.attach({
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
        CalendarSelectorShowStudents: this.showStudents,
        CalendarSelectorShowGroups: this.showGroups,
    };

    async showStudents() {
        this.updateSelector('students');
    }

    async showGroups() {
        this.updateSelector('groups');
    }

    async updateSelector(selType : string) {
        window.sessionStorage.setItem('calendarSelectionType', selType);
        this.updateView(await this.render());
    }

    async init() {
        window.sessionStorage.setItem('calendarSelectionType', '');
    }

    async setStudent(id) {
        console.log(`[Calendar] Setting student to ${id}`);

        if (window.sessionStorage) {
            const storedId = nullishCheck(window.sessionStorage.getItem('calendarStudentID'), 'none');

            // dont bother setting and refreshing everything
            // if we've selected the same student.
            if (storedId === id) {
                return;
            }
        }

        window.sessionStorage.setItem('calendarStudentID', id);

        this.emit('RefreshCalendarController');
        this.emit('RefreshCalendarView');
    }

    async render() {
        const selectionType = window.sessionStorage.getItem('calendarSelectionType');
        switch (selectionType) {
        case 'students':
            const studentsEl = await new StudentSelector().attach();
        return section('.full-width', studentsEl);
        case 'groups':
            const groupEl = await new GroupSelector().attach();
            return section('.full-width', groupEl);
        default:
            return section('.full-width', p("Debugging!"));
        }
    }
}

export default SelectorPanel;
