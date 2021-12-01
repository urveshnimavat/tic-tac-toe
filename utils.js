// checking game win
const checkTriple = (array) => {
	const checkFor0 = array.every((element) => element === '0');
	if (checkFor0) return true;
	const checkForX = array.every((element) => element === 'X');
	if (checkForX) return true;
	return false;
};

const addRows = (array, startingIndex) => {
	const result = [];
	for (let i = startingIndex; i < startingIndex + 3; i++) {
		result.push(array[i]);
	}
	return result;
};

const addColumns = (array, startingIndex) => {
	const result = [];
	for (let i = startingIndex; i < array.length; i = i + 3) {
		result.push(array[i]);
	}
	return result;
};

const leftDiagonal = (array) => [array[0], array[4], array[8]];

const rightDiagonal = (array) => [array[2], array[4], array[6]];

const consoleBoard = (array, index) => array[index] + array[index + 1] + array[index + 2] + '\n';

export const isGameWon = (array) => {
	if (checkTriple(addRows(array, 0))) return true;
	if (checkTriple(addRows(array, 3))) return true;
	if (checkTriple(addRows(array, 6))) return true;
	if (checkTriple(addColumns(array, 0))) return true;
	if (checkTriple(addColumns(array, 1))) return true;
	if (checkTriple(addColumns(array, 2))) return true;
	if (checkTriple(leftDiagonal(array))) return true;
	if (checkTriple(rightDiagonal(array))) return true;

	return false;
};

// checking game tie
export const isTie = (array) => array.some((element) => element === '.');

// checking user input between 1 to 9
export const isValidInput = (number) => {
	if (parseInt(number) >= 1 && parseInt(number) <= 9) return true;
	return false;
};

// printing board
export const printBoard = (array) => {
	let result = '';
	for (let i = 0; i < array.length; i = i + 3) {
		result = result.concat(consoleBoard(array, i));
	}
	return result;
};

// checking free spot
export const isSpotAvailable = (array, index) => array[index - 1] === '.';
