// @flow
import { canvas } from '../../../../core/html';

import { Component } from '../../../../core/component';

const config = (min, avg, max) => {
    return {
        type: 'bar',
        data: {
            labels: [
                'Min. Score',
                'Avg. Score',
                'Max. Score',
            ],
            datasets: [
                {
                    data: [
                        (min * 100),
                        (avg * 100),
                        (max * 100),
                    ],
                    backgroundColor: [
                        '#b71c1c',
                        '#f57f17',
                        '#558b2f',
                    ],
                    borderWidth: 0,
                },
            ],
        },
        options: {
            legend: {
                display: false,
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 100,
                        },
                    },
                ],
            },
            maintainAspectRatio: true,
            responsive: true,
        },
    };
};

class ScoresGraph extends Component {
    chartObj: any;

    async render() {
        return canvas('#scores.chart');
    }

    async afterMount() {
        const { graphData } = this.props;
        const {
            min,
            avg,
            max,
        } = graphData;
        const ctx: CanvasRenderingContext2D = this.view.getContext('2d');

        // console.log(ctx);
        this.chartObj = new window.Chart(ctx, config(min, avg, max));
    }
}

export default ScoresGraph;