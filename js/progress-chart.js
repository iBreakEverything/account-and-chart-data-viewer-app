window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

let labels = ['a','b','c','d','e'];

let data = [1232, 1123, 1232,112321, 12323];
let data2 = data.map(function(e){return e % 30});

const chartData = {
	labels: labels,
	datasets: [{
		backgroundColor: window.chartColors.grey,
		data: data2,
	}]
};

/**
 * TODO
 */
const originalLineDraw = Chart.controllers.horizontalBar.prototype.draw;
Chart.helpers.extend(Chart.controllers.horizontalBar.prototype, {

	draw: function () {

		originalLineDraw.apply(this, arguments);

		let chart = this.chart;
		let ctx = chart.chart.ctx;

		let vector = chart.config.options.lineAtIndex;
		for (let i = vector.length - 1; i >= 0; i--) {

			if (vector[i]) {

				let xAxis = chart.scales['x-axis-0'];
				let yAxis = chart.scales['y-axis-0'];

				let x1 = xAxis.getPixelForValue(vector[i]);                       
				let y1 = yAxis.height * 0.1;                                                   

				let x2 = xAxis.getPixelForValue(vector[i]);                       
				let y2 = yAxis.height * 1.05;                                        

				ctx.save();
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.strokeStyle = 'red';
				ctx.lineTo(x2, y2);
				ctx.stroke();

				ctx.restore();
			}
		}
	}
});

/**
 * TODO
 */
function initChart(chartData) {
	let ctx = document.getElementById('canvas').getContext('2d');
	window.myMixedChart = new Chart(ctx, {
		type: 'horizontalBar',
		data: chartData,
		options: {
			lineAtIndex: [3, 7, 14, 30],
			title: {
				display: false
			},
			maintainAspectRatio: false,
			tooltips: {
				mode: 'index',
				intersect: false
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
function progress_chart() {

	initChart(chartData);
}
