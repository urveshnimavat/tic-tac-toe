// Depedencies
import { io } from 'socket.io-client';
import readline from 'readline';

// command line reader
const lineReader = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// socket connection with specified IP and client
const socket = io(`http://${process.argv[2]}:${process.argv[3]}`);

let gameWon = false;

// socket events
socket.on('message', (msg) => {
	console.log(msg);

	socket.on('win', (msg) => {
		gameWon = true;
		console.log(msg);
		process.exit();
	});
});

socket.on('turn', (msg) => {
	if (msg !== '') {
		console.log(msg);
	}
	lineReader.question('Enter Number: ', function (result) {
		if (gameWon === true) {
			return lineReader.close();
		}
		if (result === 'r') {
			// console.log(result);
			socket.emit('quit', '');
		} else {
			socket.emit('move', result);
		}
	});
});

socket.on('logBoard', function (data) {
	console.log(`\n${data}`);
});

socket.on('error', function (message) {
	console.log(message);
});

// on scoket disconect
socket.on('disconnect', function () {
	console.log(`client disconnected`);
});
