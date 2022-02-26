class PayloadResponse {

	/** @param {Number} */
	#code;

	/** @param {Array} */
	#meta;

	/** @param {Array} */
	#data;

	/** @param {Array} */
	#errors;

	#clientErrorProcessors;

	/** @var {PayloadExtension[]} */
	#extensions;

	/**
	 * @param {PayloadExtension[]} extensions
	 */
	constructor(response, clientErrorProcessors, extensions) {
		this.#clientErrorProcessors = clientErrorProcessors;
		this.#extensions = extensions;

		if (typeof response !== 'object' || response === null) {
			throw new Error('Response must be an object.');
		}

		if (typeof response.code !== 'number') {
			throw new Error('Response code must be an number.');
		}

		this.#code = response.code;

		if (!Array.isArray(response.meta)) {
			throw new Error('Response meta must be an array.');
		}

		this.#meta = response.meta;

		if (!Array.isArray(response.data)) {
			throw new Error('Response data must be an array.');
		}

		this.#data = response.data;

		if (!Array.isArray(response.errors)) {
			throw new Error('Response errors must be an array.');
		}

		this.#errors = response.errors.map(error => {
			if (typeof error.message !== 'string') {
				throw new Error('Response error message must be a string.');
			}

			if (typeof error.type !== 'string') {
				throw new Error('Response error type must be a string.');
			}

			return error;
		});

		this.#extensions.forEach(extension => extension.before(this));

		this.#process();

		this.#extensions.forEach(extension => extension.after(this));
	}

	#process() {
		this.getCriticalErrors().forEach(error => {
			console.error(error.message)
		});

		this.#clientErrorProcessors.forEach(processor => {
			this.getClientErrors().forEach(error => {
				processor(error);
			})
		});
	}

	isSuccess() {
		return this.#code >= 200 && this.#code < 300;
	}

	isError() {
		return !this.isSuccess();
	}

	hasErrors() {
		return this.#errors.length !== 0;
	}

	hasMeta(key) {
		return typeof this.#meta[key] !== 'undefined';
	}

	getMeta(key) {
		return this.#meta[key];
	}

	getData() {
		return this.#data;
	}

	getCode() {
		return this.#code;
	}

	getClientErrors() {
		return this.#errors.filter(error => error.type === 'client');
	}

	getErrors() {
		return this.#errors;
	}

	/**
	 * @returns {Array}
	 */
	getCriticalErrors() {
		return this.#errors.filter(error => error.type === 'critical');
	}

}

class PayloadExtension {

	/**
	 * @param {PayloadResponse} payload
	 */
	before(payload) {

	}

	/**
	 * @param {PayloadResponse} payload
	 */
	after(payload) {

	}

}

export default class PayloadResponseFactory {

	#clientErrorProcessors = [];

	/** @var {PayloadExtension[]} */
	#extensions = [];

	/**
	 * @param {PayloadExtension} extension
	 */
	addExtension(extension) {
		this.#extensions.push(extension);
	}

	addClientErrorProcessor(processor) {
		this.#clientErrorProcessors.push(processor);
	}

	/**
	 * @param {Promise<Response>} fetch
	 * @return {Promise<PayloadResponse>}
	 */
	async createFetch(fetch) {
		return new PayloadResponse(
			await (await fetch).json(),
			this.#clientErrorProcessors,
			this.#extensions,
		);
	}

}
