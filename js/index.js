let db = require('../js/DataBasic.js');

let accountDb = new db('accountData.db');
let validTime = 86400; // 1 day TODO move to config
let flexSize = 2; //TODO move to config


/**
 * TODO
 */
function showAccounts() {

	let dbFields = ['account', 'email', 'balance'];
	let customFields = ['ExpDate'];

	// account card
	let container = document.getElementById('accountData');
	if (accountDb.isEmpty()) {
		container.innerHTML = 'No account found in database.';
		return;
	}

	let button = document.createElement('button');
	button.setAttribute('class', 'btn btn-warning');
	button.setAttribute('type', 'button');
	button.setAttribute('id', 'updateBalance');
	button.innerText = 'Refresh balance!';
	button.addEventListener('click', getBalance);
	container.appendChild(button);

	// container for data
	let flexBox = document.createElement('div');
	flexBox.setAttribute('class', 'd-flex justify-content-between');

	for (var i = dbFields.length - 1; i >= 0; i--) {
		let flexCol = document.createElement('div');
		flexCol.setAttribute('class', 'd-flex flex-column');
		flexCol.classList.add('order-' + i.toString());
		for (let j = accountDb.db.data.length - 1; j >= -1; j--) {
				let flexItem = document.createElement('div');
				flexItem.classList.add('p-' + flexSize, 'order-' + (j + 1).toString());
			if (j === -1) {
				flexItem.classList.add('flex-table-header');
				flexItem.innerHTML = dbFields[i].charAt(0).toUpperCase() + dbFields[i].slice(1);
			} else {
				flexItem.classList.add(dbFields[i]);
				flexItem.innerHTML = accountDb.db.data[j][dbFields[i]];
			}
			flexCol.appendChild(flexItem);
		}
		flexBox.appendChild(flexCol);
	}

	for (var i = customFields.length - 1; i >= 0; i--) {
		let flexCol = document.createElement('div');
		flexCol.setAttribute('class', 'd-flex flex-column');
		flexCol.classList.add('order-' + (i + dbFields.length).toString());
		for (let account of accountDb.db.data) {
			if (account.order == 1) {
				let flexHeadder = document.createElement('div');
				flexHeadder.classList.add('flex-table-header', 'order-0','p-' + flexSize);
				flexHeadder.innerHTML = customFields[i].charAt(0).toUpperCase() + customFields[i].slice(1);
				flexCol.appendChild(flexHeadder);
			}
			let flexItem = document.createElement('div');
			flexItem.classList.add('p-' + flexSize, 'order-' + account.order, customFields[i]);
			switch(customFields[i]) {
				case 'ExpDate': {
					let expDate = new Date(account.exp * 1000);
					flexItem.innerHTML = expDate.toDateString();
					break;
				}
				default: {
					flexItem.innerHTML = '-';
					break;
				}
			}
			flexCol.appendChild(flexItem);
		}
		flexBox.appendChild(flexCol);
	}
	container.appendChild(flexBox);
}

/**
 * TODO
 */
function getBalance() {
	//call for each account
	for (let account of accountDb.db.data) {
		console.log(account.order);
		//balance order- + 
	}
	//set for each account
	
}

/**
 * TODO
 */
function checkForm(event) {
	let forms = document.getElementsByClassName('form-control');
	let record = { 
		account:	null,
		token:		null,
		uid:		null,
		exp:		null,
		email:		null,
		balance:	-1,
		order:		accountDb.db.data.length + 1,
	};
	for (let form of forms) {
		let retVal = isValid(form);
		if (retVal === false) {
			document.getElementById(form.id).classList.add('is-invalid');
			event.preventDefault();
			event.stopPropagation();
		} else {
			switch (Object.prototype.toString.call(retVal)) {
				case '[object String]':
					record.account = retVal;
					break;
				case '[object Object]':
					record.token = retVal.token;
					record.email = retVal.email;
					record.uid = retVal.uid;
					record.exp = retVal.exp;
					break;
				default:
					break;
			}
		}
	}
	if (document.getElementsByClassName('is-invalid').length !== 0) {
		return;
	}
	accountDb.insert(record);
}

/**
 * TODO
 */
function isValid(form) {

	let data = form.value.trim();
	let id = form.id;

	//check for empty fields
	if (!data) {
		return false;
	}

	switch(id) {

		case 'accountName': {
			// account name is not in db
			if (accountDb.find({account:data})[0] === undefined) {
				return data;
			}
			document.getElementById(id + 'Err').innerHTML = 'Account exists in database.';
			return false;
		}

		case 'jwtToken': {
			let retVal = { token:data, uid:null, exp:null, email:null }
			let token = data.substring(4).split('.');
			try {
				let header = Buffer.from(token[0], 'base64').toString('utf8');
				let payload = Buffer.from(token[1], 'base64').toString('utf8');
				JSON.parse(header);
				let parsedPayload = JSON.parse(payload);
				if (parsedPayload.exp - validTime < Date.now() / 1000) {
					document.getElementById(id + 'Err').innerHTML = 'JWT token is about to expire.';
					return false;
				}
				if (accountDb.find({uid:parsedPayload.uid})[0] !== undefined) {
					document.getElementById(id + 'Err').innerHTML = 'Entry with same UID exists in database.';
					return false;
				}
				retVal.email = parsedPayload.email;
				retVal.uid = parsedPayload.uid;
				retVal.exp = parsedPayload.exp;
			} catch(err) {
				document.getElementById(id + 'Err').innerHTML = 'Invalid JWT token.';
				return false;
			}
			return retVal;
		}
	}
	return false;
}

/**
 * TODO
 */
function resetFieldCheck(fieldId) {
	let fieldMessage = [
		{id:'accountName',message:'Enter account name.',},
		{id:'jwtToken',message:'Enter JWT token.',},
	];
	let element = document.getElementById(fieldId)
	document.getElementById(fieldId + 'Err').innerHTML = fieldMessage.find((x) => (x.id === fieldId)).message;
	element.classList.remove('is-valid');
	element.classList.remove('is-invalid');
}

/**
 * TODO
 */
function index() {
	showAccounts();
	document.getElementById('form').addEventListener('submit', function(event){checkForm(event)});
	document.getElementById('accountName').addEventListener('input', function(){resetFieldCheck('accountName')});
	document.getElementById('jwtToken').addEventListener('input', function(){resetFieldCheck('jwtToken')});
}
