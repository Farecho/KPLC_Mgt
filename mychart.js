  // Wait for the DOM to fully load
  document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('myChart').getContext('2d');
    const ctx2 = document.getElementById('myChart2').getContext('2d');
    const ctx3 = document.getElementById('myChart3').getContext('2d');
    const ctx4 = document.getElementById('myChart4').getContext('2d');
    const ctx5 = document.getElementById('myChart5').getContext('2d');
    const ctx6 = document.getElementById('myChart6').getContext('2d');
    
    // Create the chart
    new Chart(ctx, {
        type: 'bar', // Type of chart (bar, line, pie, etc.)
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'], // X-axis labels
            datasets: [{
                label: 'Monthly Sales',
                data: [12, 19, 3, 5, 2], // Data points
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(153, 102, 255)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true, // Show legend
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true // Ensure the Y-axis starts at 0
                }
            }
        }
    });

    new Chart(ctx2, {
        type: 'line', // Type of chart (bar, line, pie, etc.)
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'], // X-axis labels
            datasets: [{
                label: 'Monthly Sales',
                data: [12, 19, 3, 5, 2], // Data points
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(153, 102, 255)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true, // Show legend
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true // Ensure the Y-axis starts at 0
                }
            }
        }
    });

    new Chart(ctx3, {
        type: 'pie', // Type of chart (bar, line, pie, etc.)
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'], // X-axis labels
            datasets: [{
                label: 'Monthly Sales',
                data: [12, 19, 3, 5, 2], // Data points
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(153, 102, 255)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true, // Show legend
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true // Ensure the Y-axis starts at 0
                }
            }
        }
    });

    new Chart(ctx4, {
        type: 'bar', // Type of chart (bar, line, pie, etc.)
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'], // X-axis labels
            datasets: [{
                label: 'Monthly Sales',
                data: [12, 19, 3, 5, 2], // Data points
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(153, 102, 255)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true, // Show legend
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true // Ensure the Y-axis starts at 0
                }
            }
        }
    });

    new Chart(ctx5, {
        type: 'doughnut', // Type of chart (bar, line, pie, etc.)
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'], // X-axis labels
            datasets: [{
                label: 'Monthly Sales',
                data: [12, 19, 3, 5, 2], // Data points
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(153, 102, 255)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true, // Show legend
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true // Ensure the Y-axis starts at 0
                }
            }
        }
    });

    new Chart(ctx6, {
        type: 'doughnut', // Type of chart (bar, line, pie, etc.)
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'], // X-axis labels
            datasets: [{
                label: 'Monthly Sales',
                data: [12, 19, 3, 5, 2], // Data points
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(153, 102, 255)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true, // Show legend
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true // Ensure the Y-axis starts at 0
                }
            }
        }
    });

});