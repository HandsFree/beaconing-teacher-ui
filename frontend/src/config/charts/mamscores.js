const config = {
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
                    (window.chartParams.scores.min * 100),
                    (window.chartParams.scores.avg * 100),
                    (window.chartParams.scores.max * 100),
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
        responsive: true,
    },
};

export default config;
