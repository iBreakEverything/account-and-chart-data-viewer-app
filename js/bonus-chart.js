window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

const labels = ['1', '2', '3', '4', '5'];

let data1 = [0, 0, 7, 1, 29];
let data2 = [9, 50, 90, 190, 482];
let data3 = [9, 50, 100, 200, 500];
let data4 = [5, 30, 75, 120, 344];

/**
 * TODO
 */
function initChart(chartData) {
	let ctx = document.getElementById('canvas').getContext('2d');
	window.myMixedChart = new Chart(ctx, {
		clicked: false,
		type: 'bar',
		data: chartData,
		options: {
			title: {
				display: false
			},
			maintainAspectRatio: false,
			tooltips: {
				mode: 'index',
				intersect: false
			},
			scales: {
				xAxes: [{
					stacked: true
				}],
				yAxes: [{
					stacked: false,
					ticks: {
						beginAtZero: true,
					}
				}]
			}
		}
	});
}

/**
 * TODO
 */
function updateChart(newData) {
	window.myMixedChart.data = newData;
	window.myMixedChart.update()
}

/**
 * TODO
 */
function getDatasetObject(labels, data1, data2, data3, data4) {
	return {
		labels: labels,
		datasets: [{
			type: 'line',
			label: 'Average',
			borderColor: window.chartColors.yellow,
			borderWidth: 2,
			fill: false,
			data: data4
		}, {
			type: 'bar',
			label: 'Lowest Recorded Value',
			backgroundColor: window.chartColors.red,
			data: data1
		}, {
			type: 'bar',
			label: 'Highest Recorded Value',
			backgroundColor: window.chartColors.grey,
			data: data2
		}, {
			type: 'bar',
			label: 'Highest Possible Value',
			backgroundColor: window.chartColors.green,
			data: data3
		}]
	};
}

/**
 * TODO
 */
function handleLabelClick(evt) {
	if (window.myMixedChart.clicked) {
		updateChart(getDatasetObject(labels, data1, data2, data3, data4));
		window.myMixedChart.clicked = false;
	} else {
		let firstPoint = window.myMixedChart.getElementAtEvent(evt)[0];
		if (firstPoint) {
			let index = firstPoint._index;
			updateChart( 
				getDatasetObject(
					[ labels[index] ],
					[ data1[index] ],
					[ data2[index] ],
					[ data3[index] ],
					[ data4[index], data4[index] ]
				)
			);
		}
		window.myMixedChart.clicked = true;
	}
}

/**
 * TODO
 */
function bonus_chart() {
	initChart(getDatasetObject(labels, data1, data2, data3, data4));
	document.getElementById("canvas").addEventListener('click', handleLabelClick);
}
