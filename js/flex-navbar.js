/**
 * TODO
 */
function flex_navbar() {

	const elementSize = 3;

	const pages = [
		{
			index: 0,
			href:'index.html',
			name:'Website Tools'
		},
		{
			index: 1,
			href:'bonus-chart.html',
			name:'Bonus Chart'
		},
		{
			index: 2,
			href:'progress-chart.html',
			name:'Progress Chart'
		},
	];

	let flex = document.createElement('div');
	flex.setAttribute('id', 'navbar');
	flex.setAttribute('class', 'd-flex flex-row');

	let activePage = pages.find(x => (x.href === location.pathname.split('/').pop())).index;

	for (let i = 0; i < pages.length; i++) {

		let aElem = document.createElement('a');
		aElem.setAttribute('href', pages[i].href);
		aElem.innerHTML = pages[i].name.toString();

		let divElem = document.createElement('div');
		divElem.classList.add('p-' + elementSize.toString());
		divElem.classList.add('order-' + i.toString());
		if (pages[i].index === 0) {
			divElem.classList.add('custom-brand');
		} else {
			if (activePage === i) {
				divElem.classList.add('active');
			}
			divElem.classList.add('custom-page');
		}
		divElem.appendChild(aElem);

		flex.appendChild(divElem);
	}

	let wrap = document.getElementById("wrapper");
	wrap.insertAdjacentElement('afterbegin', flex);
}