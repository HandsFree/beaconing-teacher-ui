// @flow
import { canvas } from '../../../../core/html';

import { Component } from '../../../../core/component';

const config = async (progress) => {
    return {
        type: 'bar',
        data: {
            labels: [
                await window.bcnI18n.getPhrase('cr_analytics_sp'),
            ],
            datasets: [
                {
                    data: [
                        progress,
                    ],
                    backgroundColor: [
                        'rgba(85, 139, 47, 0.2)',
                    ],
                    borderColor: [
                        'rgba(85, 139, 47, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            legend: {
                display: false,
            },
            scales: {
                xAxes: [
                    {
                        stacked: true,
                    },
                ],
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            max: 100,
                        },
                        stacked: true,
                    },
                ],
            },
            maintainAspectRatio: true,
            responsive: true,
        },
    };
};

class ProgressGraph extends Component {
    chartObj: any;

    async render() {
        return canvas('#progress.chart');
    }

    async afterMount() {
        const progress = this.props.graphData;
        const ctx: CanvasRenderingContext2D = this.view.getContext('2d');

        const progNum = progress * 100;
        this.chartObj = new window.Chart(ctx, await config(progNum));
    }
}

export default ProgressGraph;
