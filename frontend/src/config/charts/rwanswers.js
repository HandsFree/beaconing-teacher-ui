const config = {
    type: 'pie',
    data: {
        labels: [
            'Right Answers',
            'Wrong Answers',
        ],
        datasets: [
            {
                data: [
                    window.chartParams.alternatives.correct,
                    window.chartParams.alternatives.incorrect,
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
        responsive: true,
    },
};

export default config;
