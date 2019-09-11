/* eslint no-invalid-this: 0 no-console: 0 */
// const eioUtils = require('elasticio-node').messages;
const {getExpression} = require('./../expressions/customerToOih.js');
const {transform} = require('./transform.js');

/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 */
async function processAction(msg) {
	console.log("transformCustomerToOih - process");
	try {
		const expression = getExpression(msg);
		console.log('FLAG 3');
		const result = await transform(expression);
		console.log('FLAG 4');
		if (result !== undefined) {
			console.log("transformed Message: " + JSON.stringify({"body": result.body}));
			return {"body": result.body};
		}
		return;
	} catch (e) {
		console.log(`ERROR: ${e}`);
		throw new Error(e);
	}
}

module.exports.process = processAction;