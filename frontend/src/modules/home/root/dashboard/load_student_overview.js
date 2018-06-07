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

        this.state.classes = groups; // groups.filter(classObj => classObj?.category === 'class');

        if (this.state.classes && this.state.classes.length > 0) {
            const classID = id ?? this.state.classes[0]?.id;

            // console.log(classID);

            this.state.classID = classID;
            this.state.sort = sort;

            const overview = await window.beaconingAPI.getStudentOverviewAnalytics(classID, sort);

            this.state.overview = overview;
        }
    }

    async render() {
        const { classes } = this.state;

        // console.log(classes);

        if (!classes || classes.length < 1) {
            return div(
                '#student-overview',
                div(
                    '.flex-container',
                    p(await window.bcnI18n.getPhrase('widget_so_no_group')),
                ),
            );
        }

        const {
            students,
            improvement,
        } = this.state.overview;
        const sort = new Sort();

        const sortEl = await sort.attach({
            classes: this.state.classes,
            id: this.state.classID,
            sort: this.state.sort,
        });

        if (students && (students.length >= 6 && improvement.length >= 3)) {
            const bestPerforming = new Panel();
            const needsAttention = new Panel();
            const mostImprovement = new Panel();

            const bpData = students.slice(0, 3);
            const naData = students.slice(-3).reverse();
            const miData = improvement.slice(0, 3);

            const bestPerformingEl = await bestPerforming.attach({
                title: await window.bcnI18n.getPhrase('widget_so_bp'),
                msg: await window.bcnI18n.getPhrase('widget_so_op'),
                data: bpData,
            });
            const needsAttentionEl = await needsAttention.attach({
                title: await window.bcnI18n.getPhrase('widget_so_na'),
                msg: await window.bcnI18n.getPhrase('widget_so_op'),
                data: naData,
            });
            const mostImprovementEl = await mostImprovement.attach({
                title: await window.bcnI18n.getPhrase('widget_so_mi'),
                msg: await window.bcnI18n.getPhrase('widget_so_oi'),
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
            sortEl,
            div(
                '.flex-container',
                p('This group has too few students! (needs 6 or more)'),
            ),
        );
    }
}

export default LoadStudentOverview;
