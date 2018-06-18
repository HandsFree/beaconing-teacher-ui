// @flow
import { div, p } from '../../../../core/html';

import { Component } from '../../../../core/component';
import AlternativesGraph from './alternatives_graph';
import ProgressGraph from './progress_graph';
import ScoresGraph from './scores_graph';
import CompletionGraph from './completion_graph';

class Charts extends Component {
    state = {
        analyticsData: {},
    };

    async init() {
        const { id } = this.props;

        const analyticsData = await window.beaconingAPI.getStudentAnalytics(id);

        this.state.analyticsData = analyticsData;

        window.Chart.defaults.global.defaultFontColor = 'white';
    }

    async render() {
        const alternativesGraph = new AlternativesGraph();
        const progressGraph = new ProgressGraph();
        const scoresGraph = new ScoresGraph();
        const completionGraph = new CompletionGraph();

        const rwText = await window.bcnI18n.getPhrase('cr_analytics_rw');
        const sopText = await window.bcnI18n.getPhrase('cr_analytics_sop');
        const mamText = await window.bcnI18n.getPhrase('cr_analytics_mam');
        const aspText = await window.bcnI18n.getPhrase('cr_analytics_asp');

        const graphWrapper = (title, el) => div(
            '.tile.spacing.flex-column.flex-3',
            div(
                '.title',
                p(title),
            ),
            div(
                '.content.graph',
                el,
            ),
        );

        return Promise.all([
            alternativesGraph.attach({
                graphData: this.state.analyticsData?.alternatives,
            }),
            progressGraph.attach({
                graphData: this.state.analyticsData?.progress,
            }),
            scoresGraph.attach({
                graphData: this.state.analyticsData?.scores,
            }),
            completionGraph.attach({
                graphData: this.state.analyticsData?.durations,
            }),
        ]).then((elements) => {
            const [
                alternativesGraphEl,
                progressGraphEl,
                scoresGraphEl,
                completionGraphEl,
            ] = elements;

            return div(
                '.flex-wrap',
                graphWrapper(rwText, alternativesGraphEl),
                graphWrapper(sopText, progressGraphEl),
                graphWrapper(mamText, scoresGraphEl),
                graphWrapper(aspText, completionGraphEl),
            );
        });
    }
}

export default Charts;
