// @flow
import { div, h2, canvas } from '../../../../core/html';

import { Component } from '../../../../core/component';

const config = async (correct, incorrect) => {
    return {
        type: 'pie',
        data: {
            labels: [
                await window.beaconingAPI.getPhrase('cr_analytics_ra'),
                await window.beaconingAPI.getPhrase('cr_analytics_wa'),
            ],
            datasets: [
                {
                    data: [
                        correct,
                        incorrect,
                    ],
                    backgroundColor: [
                        '#558b2f',
                        '#b71c1c',
                    ],
                    borderWidth: 0,
                },
            ],
        },
        options: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    fontColor: 'black',
                    fontSize: 18,
                },
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: 'black',
                        fontSize: 18,
                        stepSize: 1,
                        beginAtZero: true,
                    },
                }],
                xAxes: [{
                    ticks: {
                        fontColor: 'black',
                        fontSize: 14,
                        stepSize: 1,
                        beginAtZero: true,
                    },
                }],
            },
            maintainAspectRatio: true,
            responsive: true,
        },
    };
};

class AlternativesGraph extends Component {
    chartObj: any;

    async render() {
        return canvas('#alternatives.chart');
    }

    async afterMount() {
        const { graphData } = this.props;
        const {
            correct,
            incorrect,
        } = graphData;

        if (correct === 0 && incorrect === 0) {
            return div(h2(await window.beaconingAPI.getPhrase('err_no_data')));
        }

        const ctx: CanvasRenderingContext2D = this.view.getContext('2d');

        // console.log(ctx);
        this.chartObj = new window.Chart(ctx, await config(correct, incorrect));
    }
}

export default AlternativesGraph;
