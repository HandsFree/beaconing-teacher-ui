// @flow
import { div, p, a, i } from '../../../../core/html';

import { Component } from '../../../../core/component';
import LoadStudentOverview from './load_student_overview';

class StudentOverview extends Component {
    state = {
        classID: null,
        sortType: 'week',
    };

    updateHooks = {
        StudentOverviewClassChange: this.updateClass,
        StudentOverviewSortWeekClicked: this.sortWeek,
        StudentOverviewSortMonthClicked: this.sortMonth,
        StudentOverviewSortYearClicked: this.sortYear,
    };

    async updateClass() {
        const soClassList = document.getElementById('so-class-list');

        if (soClassList) {
            this.state.classID = soClassList.value;
        }

        // console.log(this.state.classID);

        const el = await this.loadOverview(this.state.classID, this.state.sortType);
        this.updateView(el);
    }

    async sortWeek() {
        this.state.sortType = 'week';
        const el = await this.loadOverview(this.state.classID, this.state.sortType);
        this.updateView(el);
    }

    async sortMonth() {
        this.state.sortType = 'month';
        const el = await this.loadOverview(this.state.classID, this.state.sortType);
        this.updateView(el);
    }

    async sortYear() {
        this.state.sortType = 'year';
        const el = await this.loadOverview(this.state.classID, this.state.sortType);
        this.updateView(el);
    }

    async render() {
        return div(
            '.draggable.tile.flex-column',
            div(
                '.title',
                p(await window.bcnI18n.getPhrase('widget_so_title')),
                a(
                    {
                        href: `//${window.location.host}/classroom/`,
                    },
                    i(
                        '.icon-link-ext-alt',
                        {
                            title: await window.bcnI18n.getPhrase('widget_so_link_title'),
                            'aria-hidden': true,
                        },
                    ),
                ),
            ),
            div(
                '.content',
                div(
                    '#student-overview',
                    p(`${await window.bcnI18n.getPhrase('ld')}...`),
                ),
            ),
        );
    }

    async loadOverview(classID: ?number, sort: string) {
        const loadStudentOverview = new LoadStudentOverview();

        const loadStudentOverviewEl = await loadStudentOverview.attach({
            id: classID,
            sort,
        });

        const el = div(
            '.draggable.tile.flex-column',
            div(
                '.title',
                p(await window.bcnI18n.getPhrase('widget_so_title')),
                a(
                    {
                        href: `//${window.location.host}/classroom/`,
                    },
                    i(
                        '.icon-link-ext-alt',
                        {
                            title: await window.bcnI18n.getPhrase('widget_so_link_title'),
                            'aria-hidden': true,
                        },
                    ),
                ),
            ),
            div(
                '.content',
                loadStudentOverviewEl,
            ),
        );

        return el;
    }

    async afterMount() {
        this.sortWeek();
    }
}

export default StudentOverview;
