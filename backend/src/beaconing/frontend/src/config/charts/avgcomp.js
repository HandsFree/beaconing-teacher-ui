const config = {
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
                    (window.chartParams.durations.yours * 100),
                    (window.chartParams.durations.others * 100),
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
        responsive: true,
    },
};

export default config;
