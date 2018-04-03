// @flow
import { canvas } from '../../../../core/html';

import { Component } from '../../../../core/component';

const config = (yours, others) => {
    return {
        type: 'polarArea',
        data: {
            labels: [
                'Student Progress',
                'Avg. Students Progress',
            ],
            datasets: [
                {
                    label: 'Progress',
                    data: [
                        (yours * 100),
                        (others * 100),
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
        this.chartObj = new window.Chart(ctx, config(yours, others));
    }
}

export default CompletionGraph;
