// @flow
import { canvas } from '../../../../core/html';

import { Component } from '../../../../core/component';

const config = (correct, incorrect) => {
    return {
        type: 'pie',
        data: {
            labels: [
                'Right Answers',
                'Wrong Answers',
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
        const ctx: CanvasRenderingContext2D = this.view.getContext('2d');

        // console.log(ctx);
        this.chartObj = new window.Chart(ctx, config(correct, incorrect));
    }
}

export default AlternativesGraph;
