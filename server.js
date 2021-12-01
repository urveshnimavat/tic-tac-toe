// Depedencies
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { printBoard, isValidInput, isGameWon, isTie, isSpotAvailable } from './utils.js';

const app = express();
const httpServer = createServer(app);
const port = process.argv[2] ? process.argv[2] : 5050;

const io = new Server(httpServer);

// board and clients initialized
let arr = [];
let clients = [];

let activeClient, inActiveClient;

// to initialize a game
const initializeGame = () => {
	arr = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];
	activeClient = clients[0];
	inActiveClient = clients[1];
};

// to reset game
const resetGame = () => {
	arr = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];
	activeClient = null;
	inActiveClient = null;
	clients = [];
};

// to change clients
const swapClient = () => {
	let tempClient = activeClient;
	activeClient = inActiveClient;
	inActiveClient = tempClient;
};

// send socket event to print board
const sendPrompt = () => {
	io.sockets.emit('logBoard', printBoard(arr));
};

// to update current board
const updateBoard = (array, index, move) => {
	array[index - 1] = move;
};

// logic for player's move on board
const isTurn = (array, index) => {
	if (!isValidInput(index)) {
		io.to(activeClient.id).emit('turn', 'Please enter input between 1 to 9');
		return;
	}

	if (!isSpotAvailable(array, index)) {
		io.to(activeClient.id).emit('turn', '\nspot already taken');
		return;
	}
	updateBoard(array, index, activeClient.move);

	if (isGameWon(array)) {
		io.emit('logBoard', printBoard(array));

		io.emit('win', `Game won by ${activeClient.name}`);
		initializeGame();
		resetGame();
		return;
	} else {
		if (!isTie(array)) {
			io.emit('logBoard', printBoard(array));
			io.emit('win', "It's a Tie!");
			initializeGame();
			resetGame();
			return;
		}
	}

	io.emit('logBoard', printBoard(array));
	io.to(inActiveClient.id).emit('turn', '');
	swapClient();
};

// socket connection
io.on('connection', (socket) => {
	let { id } = socket;
	console.log('Player connected');

	if (clients.length === 0) {
		// player 1 is ready
		clients.push({ name: 'first', id, move: 'X' });
		socket.emit('message', `You are ${clients[0].name} player \nWait till another player to join!`);
	} else if (clients.length === 1) {
		// player 2 is ready
		clients.push({ name: 'second', id, move: '0' });
		socket.emit('message', `You are ${clients[1].name} player`);

		initializeGame();
		sendPrompt();

		io.to(activeClient.id).emit('turn', 'Game Started you are first');
		io.to(inActiveClient.id).emit('message', `Wait till another player's input`);
	} else {
		// maximum number of players reached
		socket.emit('message', 'Maximum number of players are joined!');
	}

	console.log(`socket.io connected`);

	// When player makes a move
	socket.on('move', (index) => {
		// moves related logic
		isTurn(arr, index);
	});

	// when player wants to quit
	socket.on('quit', () => {
		io.emit('win', `Game won by  ${inActiveClient.name} player`);
		initializeGame();
		resetGame();
	});

	// on socket disconnect
	socket.on('disconnect', () => {
		io.emit('win', `\nYou won game! Another player left the game.`);
		resetGame();
	});
});

// on socket connection close
io.on('disconnect', () => {
	console.log('Disconnected!');
});

// listening server
httpServer.listen(port, () => console.log(`server is listening on port ${port}`));
