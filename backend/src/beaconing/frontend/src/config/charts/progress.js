const config = {
    type: 'bar',
    data: {
        labels: [
            'Student Progress',
        ],
        datasets: [
            {
                data: [
                    (window.chartParams.progress * 100),
                ],
                backgroundColor: [
                    '#558b2f',
                ],
                borderWidth: 0,
            },
            {
                data: [
                    '20',
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
                    },
                    stacked: true,
                },
            ],
        },
        responsive: true,
    },
};

export default config;
