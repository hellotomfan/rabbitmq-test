const AMQPTest = require("./amqp_test").AMQPTest;
async function main() {
	let amqp = new AMQPTest;
	await amqp.initialize();
	if (process.argv[2] === 'consumer') {
		setInterval(() => {amqp.show()}, 1000);
		await amqp.startConsumer();
	}
	else {
		await amqp.startProducer();
	}
}
main().catch((err) => {console.log(err)});

