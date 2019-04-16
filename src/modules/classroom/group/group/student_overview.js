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

    async init() {
        this.state.classID = this.props.classID;
    }

    async updateClass() {
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
            '#student-overview-container.status.flex-column.flex-align-center',
            p(await window.beaconingAPI.getPhrase('widget_so_title')),
            div(
                '.content',
                div(
                    '#student-overview',
                    p(`${await window.beaconingAPI.getPhrase('ld')}...`),
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
            '#student-overview-container.status.flex-column.flex-align-center',
            p(await window.beaconingAPI.getPhrase('widget_so_title')),
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
