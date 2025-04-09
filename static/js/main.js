// Main JavaScript for the Economic Simulation application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Economic Simulation Application initialized');

    // Initialize tooltips
    tippy('[data-tippy-content]', {
        animation: 'scale',
        theme: 'light-border',
    });

    // Setup form submission
    const simForm = document.getElementById('simParamsForm');
    if (simForm) {
        simForm.addEventListener('submit', function(e) {
            e.preventDefault();
            runSimulation();
        });
    }

    // Initialize any charts or visualizations
    initializeCharts();
});

// Function to run the simulation
function runSimulation() {
    const formData = new FormData(document.getElementById('simParamsForm'));
    const params = {};

    // Convert form data to JSON object
    for (const [key, value] of formData.entries()) {
        params[key] = isNaN(value) ? value : Number(value);
    }

    // Show loading indicator
    document.getElementById('results').innerHTML = '<div class="loader"></div><p class="text-center">Running simulation...</p>';

    // Call the API
    fetch('/run_simulation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayResults(data);
    })
    .catch(error => {
        document.getElementById('results').innerHTML = `
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p>Error: ${error.message}</p>
            </div>
        `;
    });
}

// Function to initialize charts
function initializeCharts() {
    // This will be populated when we have data
    console.log('Charts ready to be initialized');
}

// Function to display simulation results
function displayResults(data) {
    const resultsDiv = document.getElementById('results');

    // Clear previous results
    resultsDiv.innerHTML = '';

    // Create tabs for different result views
    const tabsHtml = `
        <div class="mb-4 border-b border-gray-200">
            <ul class="flex flex-wrap -mb-px" role="tablist">
                <li class="mr-2">
                    <button class="inline-block p-4 border-b-2 border-indigo-500 text-indigo-600 active"
                            id="summary-tab" data-tab="summary">Summary</button>
                </li>
                <li class="mr-2">
                    <button class="inline-block p-4 border-b-2 border-transparent hover:border-gray-300"
                            id="charts-tab" data-tab="charts">Charts</button>
                </li>
                <li class="mr-2">
                    <button class="inline-block p-4 border-b-2 border-transparent hover:border-gray-300"
                            id="data-tab" data-tab="data">Raw Data</button>
                </li>
            </ul>
        </div>
    `;

    // Create content for each tab
    const tabContentHtml = `
        <div id="summary" class="tab-content">
            <h2 class="text-xl font-semibold mb-4">Simulation Summary</h2>
            <div class="prose">
                <p>${data.summary.overview}</p>
                <h3>Key Findings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-blue-800">Wealth Impact</h4>
                        <p class="text-blue-700">${data.summary.key_findings.wealth_impact.summary}</p>
                        <p class="text-sm mt-2">${data.summary.key_findings.wealth_impact.details || ''}</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-green-800">Equality Measures</h4>
                        <p class="text-green-700">${data.summary.key_findings.equality_measures.summary}</p>
                        <p class="text-sm mt-2">${data.summary.key_findings.equality_measures.details || ''}</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-purple-800">Community Health</h4>
                        <p class="text-purple-700">${data.summary.key_findings.community_health.poverty}</p>
                        <p class="text-purple-700 mt-1">${data.summary.key_findings.community_health.resilience}</p>
                        <p class="text-sm mt-2">${data.summary.key_findings.community_health.details || ''}</p>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <h4 class="font-semibold text-yellow-800">Economic Evolution</h4>
                        <ul class="text-sm mt-2">
                            ${data.summary.phase_analysis.map(phase => `
                                <li class="mb-2">
                                    <strong>${phase.period}:</strong> ${phase.characteristics}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <h3>Conclusion</h3>
                <p>${data.summary.conclusion}</p>
            </div>
        </div>

        <div id="charts" class="tab-content hidden">
            <h2 class="text-xl font-semibold mb-4">Simulation Charts</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 class="text-lg font-medium mb-2">Wealth Over Time</h3>
                    <canvas id="wealthChart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Inequality (Gini) Over Time</h3>
                    <canvas id="giniChart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Poverty Rate Over Time</h3>
                    <canvas id="povertyChart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-medium mb-2">Community Resilience</h3>
                    <canvas id="resilienceChart"></canvas>
                </div>
            </div>
        </div>

        <div id="data" class="tab-content hidden">
            <h2 class="text-xl font-semibold mb-4">Raw Simulation Data</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Wealth A</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Wealth B</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gini A</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gini B</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200" id="dataTable">
                        <!-- Data will be inserted here -->
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Add tabs and content to the results div
    resultsDiv.innerHTML = tabsHtml + tabContentHtml;

    // Add event listeners to tabs
    document.querySelectorAll('[data-tab]').forEach(tab => {
        tab.addEventListener('click', function() {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });

            // Remove active class from all tabs
            document.querySelectorAll('[data-tab]').forEach(t => {
                t.classList.remove('border-indigo-500', 'text-indigo-600');
                t.classList.add('border-transparent');
            });

            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.remove('hidden');

            // Add active class to selected tab
            this.classList.add('border-indigo-500', 'text-indigo-600');
            this.classList.remove('border-transparent');

            // Initialize charts if charts tab is selected
            if (tabId === 'charts') {
                createCharts(data);
            }

            // Populate data table if data tab is selected
            if (tabId === 'data') {
                populateDataTable(data.history);
            }
        });
    });

    // Create charts for initial display
    createCharts(data);
}

// Function to create charts from simulation data
function createCharts(data) {
    const weeks = data.history.map(d => d.Week);

    // Wealth Chart
    const wealthCtx = document.getElementById('wealthChart').getContext('2d');
    new Chart(wealthCtx, {
        type: 'line',
        data: {
            labels: weeks,
            datasets: [
                {
                    label: 'Scenario A',
                    data: data.history.map(d => d.AvgWealth_A),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.1
                },
                {
                    label: 'Scenario B',
                    data: data.history.map(d => d.AvgWealth_B),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Average Wealth Over Time'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Wealth'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Week'
                    }
                }
            }
        }
    });

    // Gini Chart
    const giniCtx = document.getElementById('giniChart').getContext('2d');
    new Chart(giniCtx, {
        type: 'line',
        data: {
            labels: weeks,
            datasets: [
                {
                    label: 'Scenario A',
                    data: data.history.map(d => d.Gini_A),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.1
                },
                {
                    label: 'Scenario B',
                    data: data.history.map(d => d.Gini_B),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Inequality (Gini Coefficient) Over Time'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Gini Coefficient'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Week'
                    }
                }
            }
        }
    });

    // Poverty Chart
    const povertyCtx = document.getElementById('povertyChart').getContext('2d');
    new Chart(povertyCtx, {
        type: 'line',
        data: {
            labels: weeks,
            datasets: [
                {
                    label: 'Scenario A',
                    data: data.history.map(d => d.PovertyRate_A),
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.1
                },
                {
                    label: 'Scenario B',
                    data: data.history.map(d => d.PovertyRate_B),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Poverty Rate Over Time'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Poverty Rate'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Week'
                    }
                }
            }
        }
    });

    // Resilience Chart
    const resilienceCtx = document.getElementById('resilienceChart').getContext('2d');
    new Chart(resilienceCtx, {
        type: 'line',
        data: {
            labels: weeks,
            datasets: [
                {
                    label: 'Community Resilience',
                    data: data.history.map(d => d.CommunityResilience),
                    borderColor: 'rgb(139, 92, 246)',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Community Resilience Over Time'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Resilience Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Week'
                    }
                }
            }
        }
    });
}

// Function to populate the data table
function populateDataTable(history) {
    const tableBody = document.getElementById('dataTable');
    tableBody.innerHTML = '';

    history.forEach(week => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${week.Week}</td>
            <td class="px-6 py-4 whitespace-nowrap">${week.AvgWealth_A.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap">${week.AvgWealth_B.toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap">${week.Gini_A.toFixed(3)}</td>
            <td class="px-6 py-4 whitespace-nowrap">${week.Gini_B.toFixed(3)}</td>
        `;
        tableBody.appendChild(row);
    });
}
