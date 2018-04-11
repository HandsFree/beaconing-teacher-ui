// @flow

import { div, p } from '../../../../core/html';

import { Component } from '../../../../core/component';
import Sort from './student_overview_sort';
import Panel from './student_overview_panel';

class LoadStudentOverview extends Component {
    state = {
        overview: {},
        groups: [{
            id: 1,
        }],
        classID: 1,
        sort: 'week',
    };

    async init() {
        const {
            id,
            sort,
        } = this.props;

        const groups = await window.beaconingAPI.getGroups();

        this.state.classes = groups.filter(classObj => classObj?.category === 'class');

        const classID = id ?? this.state.classes[0]?.id;

        // console.log(classID);

        this.state.classID = classID;
        this.state.sort = sort;

        const overview = await window.beaconingAPI.getStudentOverviewAnalytics(classID, sort);

        this.state.overview = overview;
    }

    async render() {
        const { classes } = this.state;
        const {
            students,
            improvement,
        } = this.state.overview;

        if (students.length >= 6 && improvement.length >= 3) {
            const sort = new Sort();
            const bestPerforming = new Panel();
            const needsAttention = new Panel();
            const mostImprovement = new Panel();

            const bpData = students.slice(0, 3);
            const naData = students.slice(-3).reverse();
            const miData = improvement.slice(0, 3);

            const sortEl = await sort.attach({
                classes: this.state.classes,
                id: this.state.classID,
                sort: this.state.sort,
            });
            const bestPerformingEl = await bestPerforming.attach({
                title: 'Best Performing',
                msg: 'Overall Progress',
                data: bpData,
            });
            const needsAttentionEl = await needsAttention.attach({
                title: 'Needs Attention',
                msg: 'Overall Progress',
                data: naData,
            });
            const mostImprovementEl = await mostImprovement.attach({
                title: 'Most Improvement',
                msg: 'Overall Improvement',
                data: miData,
            });

            return div(
                '#student-overview',
                sortEl,
                div(
                    '.flex-container',
                    bestPerformingEl,
                    needsAttentionEl,
                    mostImprovementEl,
                ),
            );
        }

        return div(
            '#student-overview',
            p('Not enough student data!'),
        );
    }
}

export default LoadStudentOverview;
