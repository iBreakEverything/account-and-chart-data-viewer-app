let fs = require('fs');

/**
 * Path to database folder.
 * @type {string}
 */
const DBS_PATH = './dbs/';

/**
 * Class representing a database.
 *
 * @export
 * @class DataBasic
 */
module.exports = class DataBasic {

	/**
	 * Path to database file.
	 * @type {String}
	 * @memberOf DataBasic
	 */
	path;
	/**
	 * Contents of database file.
	 * @memberOf DataBasic
	 * @type {Object}
	 * @property {Array}  data						data container
	 * @property {Object} options					DataBasic options
	 * @property {boolean} options.uniqueRecords	allow/disallow duplicates
	 * @property {boolean} options.duplicateIndex	enable/disable duplicateIndex field
	 */
	db;

	/**
	 * Creates a DataBasic object.
	 * @param {String} path		path to .db file
	 */
	constructor(path) {
		try {
			let pathToFile = DBS_PATH + path;
			fs.mkdirSync(pathToFile.substring(0, pathToFile.lastIndexOf('/')) ,{ recursive: true });
		} catch (err) {
			console.error('Error: could not create directory.\n' + err);
			path = null;
		} finally {
			this.db = { data: [], options: {uniqueRecords:false, duplicateIndex:false} };
			if (!path) {
				this.path = DBS_PATH + 'tempDb_' + Date.now().toString() + '.db';
			} else {
				this.path = DBS_PATH + path;
				if (fs.existsSync(DBS_PATH + path)) {
					try {
						let dbRawData = fs.readFileSync(DBS_PATH + path, 'utf-8').trim();
						if (dbRawData) {
							this.db = JSON.parse(dbRawData);
						}
					} catch(err) {
						console.error(err);
					}
				}
			}
		}
	}

	/**
	 * Updates database.db.options and writes db to file.
	 * @param  {Object} { {boolean} uniqueRecords, {boolean} duplicateIndex, {number | boolean} fields }
	 */
	updateOptions({uniqueRecords = false, duplicateIndex = false} = {}) {
		this.db.options = {uniqueRecords, duplicateIndex: uniqueRecords && duplicateIndex};
		this.writeDatabase(this.path);
	}

	/**
	 * Writes db contents into the file at path.
	 * WARNING! This method will NOT check if the path or file exists.
	 * @param  {String} path	path to .db file
	 */
	writeDatabase(path) {
		fs.writeFileSync(path, JSON.stringify(this.db), 'utf-8');
	}

	/**
	 * Checks if db.data contains any objects.
	 * @returns {boolean}		true if empty, false if contains anything
	 */
	isEmpty() {
		return this.db.data[0] === undefined;
	}

	/**
	 * Find records in db matching the given query.
	 * @param  {Object} query		search query
	 * @return {Array}				found object or empty array
	 */
	find(query) {
		if (this.isEmpty() ||
			'[object Object]' !== Object.prototype.toString.call(query)) {
			return [];
		}
		let indexes = this.findIndex(query);
		let findCounter = indexes.length;
		if (!findCounter) {
			return [];
		}
		let foundObjects = [];
		for (let i = findCounter - 1; i >= 0; i--) {
			foundObjects.push(this.db.data[indexes[i]]);
		}
		return foundObjects;
	}

	/**
	 * Finds records indexes in db matching the given query.
	 * @param  {Object} query		search query
	 * @return {Array}				found indexes or empty array
	 */
	findIndex(query) {
		if (this.isEmpty() ||
			'[object Object]' !== Object.prototype.toString.call(query)) {
			return [];
		}
		let indexes = [];
		let i = 0;
		while (true) {
			let recordAux = this.db.data[i];
			if (recordAux) {
				let test = true;
				for (let key in query) {
					test = test && (recordAux[key] === query[key]);
				}
				if (test) {
					indexes.push(i);
				}
			} else {
				break;
			}
			i++;
		}
		return indexes;
	}

	/**
	 * Inserts one or multiple records in db and updates .db file.
	 * @param  {Object | Array} records		an object or an array of objects to be inserted
	 */
	insert(records) {
		if ('[object Array]' === Object.prototype.toString.call(records)) {
			for(let record of records) {
				this.insertOnce(record);
			}
		} else if ('[object Object]' === Object.prototype.toString.call(records)) {
			this.insertOnce(records);
		}
		this.writeDatabase(this.path);
	}

	/**
	 * Inserts one record in db.
	 * @param  {Object} record		search query
	 */
	insertOnce(record) {
		if (!this.isEmpty()) {
			let size = Object.keys(record).length;
			if (this.db.options.duplicateIndex) {
				size++;
			}
			if (size !== Object.keys(this.db.data[0]).length) {
				console.error("Wrong size, motherfucker!");
				return;
			}
		}
		let indexes = this.findIndex(record);
		if (indexes.length === 0 || !this.db.options.uniqueRecords) {
			if (this.db.options.duplicateIndex && record.duplicateIndex === undefined) {
				record.duplicateIndex = 1;
			}
			this.db.data.push(record);
		} else if (this.db.options.uniqueRecords) {
			if (this.db.options.duplicateIndex) {
				this.db.data[indexes.pop()].duplicateIndex++;
			}
		}
	}

	/**
	 * Updates records in db matching the given query and updates .db file.
	 * @param  {Object} query		search query
	 * @param  {Object} update		object containing {<key>: <new_value>}
	 * @return {number}				update count in database
	 */
	update(query, update) {
		if (this.isEmpty() ||
			'[object Object]' !== Object.prototype.toString.call(query) ||
			'[object Object]' !== Object.prototype.toString.call(update)) {
			return 0;
		}
		let indexes = this.findIndex(query);
		let updateCounter = indexes.length;
		for (let i = updateCounter - 1; i >= 0; i--) {
			let recordAux = this.db.data[indexes[i]];
			for (let key in update) {
				recordAux[key] = update[key];
			}
		}
		this.writeDatabase(this.path);
		return updateCounter;
	}

	/**
	 * Removes given key in db and updates .db file.
	 * @param  {String | Array} keys		key to be removed
	 */
	removeProperty(keys) {
		if (this.isEmpty()) {
			return;
		}
		if ('[object Array]' === Object.prototype.toString.call(keys)) {
			for (let record of this.db.data) {
				for (let key of keys) {
					delete record[key];
				}
			}
		} else if ('[object String]' === Object.prototype.toString.call(keys)) {
			for (let record of this.db.data) {
				delete record[keys];
			}
		}
		this.writeDatabase(this.path);
	}

	/**
	 * Removes all matching records in db and updates .db file.
	 * @param  {Object} record		search query
	 * @returns {boolean}			object removed?
	 */
	remove(record) {
		if (this.isEmpty() || '[object Object]' !== Object.prototype.toString.call(record)) {
			return false;
		}
		let indexes = this.findIndex(record);
		let i = indexes.length;
		while(i) {
			this.db.data.splice(indexes.pop(), 1);
			i--;
		}
		this.writeDatabase(this.path);
		return true;
	}
};
