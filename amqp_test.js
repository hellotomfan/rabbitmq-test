const amqplib = require('amqplib');
const _ = require('lodash');
const CHANNEL_SIZE=1;
const QUEUE_SIZE=16;
const PREFETCH_COUNT=1000;

function send(channel, queue) {
	channel.sendToQueue(queue, new Buffer('hello world'), (err) => {
		if (!err)
			send(channel, queue);
	});
}

class AMQPTest {
	constructor() {
		this.connection = null;
		this.channels = [];
		this.handles = 0;
	}
	async initialize() {
		this.connection = await amqplib.connect("amqp://localhost");
		console.log("AMQP::initialized");
		this.channels = await Promise.all(_.map(_.range(CHANNEL_SIZE), () =>  this.connection.createChannel()));
		this.queues = await Promise.all(_.map(_.range(QUEUE_SIZE), (i) =>  this.channels[i % CHANNEL_SIZE].assertQueue('queue' + i)));
	}
	async startConsumer() {
		this.startTime = (new Date())
		console.log('start consumer...');
		await Promise.all(_.map(_.range(QUEUE_SIZE), (i) =>  { 
			let channel = this.channels[i % CHANNEL_SIZE];
			channel.prefetch(PREFETCH_COUNT);
			channel.consume('queue' + i, (msg) => {this.handles++; channel.ack(msg);}) }
		));
	}
	async startProducer() {
		console.log('start producer...');
		setInterval(() => _.map(_.range(QUEUE_SIZE), (i) =>  this.channels[i % CHANNEL_SIZE].sendToQueue('queue' + i, new Buffer('hello world'))), 10);
	}
	async show() {
		console.log(this.handles / ((new Date() - this.startTime) / 1000.0)); 
	}
}
exports.AMQPTest = AMQPTest
