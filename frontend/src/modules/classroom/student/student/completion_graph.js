// @flow
import { canvas } from '../../../../core/html';

import { Component } from '../../../../core/component';

const config = async (yours, others) => {
    console.log("configurating ", yours, " vs ", others);

    // if the average is over > 100
    // we say it's 100, i.e. average is 100% complete
    const avg = Math.min(others, 100);

    const studentScore = (Math.abs(yours-avg) / yours) * 100;
    const averageScore = avg;

    return {
        type: 'polarArea',
        data: {
            labels: [
                await window.bcnI18n.getPhrase('cr_analytics_sp'),
                await window.bcnI18n.getPhrase('cr_analytics_asp'),
            ],
            datasets: [
                {
                    label: await window.bcnI18n.getPhrase('cr_analytics_p'),
                    data: [
                        studentScore,
                        averageScore,
                    ],
                    backgroundColor: [
                        'rgba(249, 168, 37, 0.75)',
                        'rgba(85, 139, 47, 0.75)',
                    ],
                    borderWidth: 0,
                },
            ],
        },
        options: {
            legend: {
                display: true,
                position: 'right',
            },
            scale: {
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    stepSize: 25,
                    showLabelBackdrop: false,
                    callback: value => `${value}%`,
                },
                reverse: false,
            },
            maintainAspectRatio: true,
            responsive: true,
        },
    };
};

class CompletionGraph extends Component {
    chartObj: any;

    async render() {
        return canvas('#completion.chart');
    }

    async afterMount() {
        const { graphData } = this.props;
        const {
            yours,
            others,
        } = graphData;
        const ctx: CanvasRenderingContext2D = this.view.getContext('2d');

        // console.log(ctx);
        this.chartObj = new window.Chart(ctx, await config(yours, others));
    }
}

export default CompletionGraph;
