/* eslint no-invalid-this: 0 no-console: 0 */
// const eioUtils = require('elasticio-node').messages;
const {getExpression} = require('./../expressions/orderToOih.js');
const {transform} = require('./transform.js');

/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 */
async function processAction(msg) {
	console.log("transformOrderToOih - process");
	try {
		console.log('msg:%j', msg);
		const expression = getExpression(msg);
		console.log(`Myyyyyy EXXPRESSION: ${JSON.stringify(expression)}`);
		console.log('jsonata Expression:%j', expression);
		const result = await transform(expression);

		if (result !== undefined) {
			// return eioUtils.newMessageWithBody(result.body);
			return {"body": result.body};
		}
		return;
	} catch (e) {
		console.log(`ERROR: ${JSON.stringify(e)}`);
		throw new Error(e);
	}
}

module.exports.process = processAction;