import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const TicTacToeScreen = () => {
	const [board, setBoard] = useState(Array(9).fill(null));
	const [currentPlayer, setCurrentPlayer] = useState('X');
	const [lineAnimation] = useState(new Animated.Value(0));

	useEffect(() => {
		checkWinner();
	}, [board]);

	const handleSquarePress = (index) => {
		if (board[index] === null) {
			const newBoard = [...board];
			newBoard[index] = currentPlayer;
			setBoard(newBoard);
			setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
		}
	};

	const renderSquare = (index) => {
		const isWinningSquare = checkWinningSquare(index);
		const squareStyle = isWinningSquare ? [styles.square, styles.winningSquare] : styles.square;

		console.log({
			index
		});

		return (
			<TouchableOpacity style={squareStyle} onPress={() => handleSquarePress(index)}>
				<Animated.Text
					style={[styles.squareText, currentPlayer === 'O' && styles.zeroEffect]}
				>
					{board[index]}
				</Animated.Text>
				{isWinningSquare && renderLine()}
			</TouchableOpacity>
		);
	};


	const checkWinningSquare = (index) => {
		console.log(index);
		const winningCombinations = [
			[0, 1, 2], // Rows
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6], // Columns
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8], // Diagonals
			[2, 4, 6],
		];

		return winningCombinations.some(combination => combination.includes(index) && checkWinner(combination));
	};


	const checkWinner = () => {
		const winningCombinations = [
			[0, 1, 2], // Rows
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6], // Columns
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8], // Diagonals
			[2, 4, 6],
		];

		for (let combination of winningCombinations) {
			const [a, b, c] = combination;
			if (
				board[a] &&
				board[a] === board[b] &&
				board[a] === board[c]
			) {
				animateLine(combination);
				break;
			}
		}
	};

	const animateLine = (combination) => {
		const lineSize = 300;
		const lineOffset = 50;

		Animated.timing(lineAnimation, {
			toValue: 1,
			duration: 500,
			useNativeDriver: false,
		}).start();
	};

	const lineInterpolation = lineAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [-400, 0], // Updated to pixel values
		extrapolate: 'clamp',
	});




	const lineStyle = () => {
		const [a, b, c] = combination;
		const isVertical = a % 3 === b % 3 && b % 3 === c % 3;
		const isHorizontal = Math.floor(a / 3) === Math.floor(b / 3) && Math.floor(b / 3) === Math.floor(c / 3);

		if (isVertical) {
			const col = a % 3;
			return {
				transform: [
					{ translateX: col === 0 ? 50 : col === 1 ? 150 : 250 },
					{ scaleY: lineInterpolation },
				],
			};
		} else if (isHorizontal) {
			const row = Math.floor(a / 3);
			return {
				transform: [
					{ translateY: row === 0 ? 50 : row === 1 ? 150 : 250 },
					{ scaleX: lineInterpolation },
				],
			};
		} else if (a === 0 && c === 8) {
			return {
				transform: [
					{ translateX: 50 },
					{ translateY: 50 },
					{ rotateZ: '45deg' },
					{ scaleY: lineInterpolation },
				],
			};
		} else if (a === 2 && c === 6) {
			return {
				transform: [
					{ translateX: 250 },
					{ translateY: 50 },
					{ rotateZ: '-45deg' },
					{ scaleY: lineInterpolation },
				],
			};
		}
	};


	const renderLine = (combination) => {
		console.log(combination);
		return (
			<Animated.View style={[styles.line, lineStyle(combination)]} />
		);
	};


	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setCurrentPlayer('X');
		lineAnimation.setValue(0);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.header}>Tic Tac Toe</Text>
			<View style={styles.board}>
				<View style={styles.row}>
					<View style={styles.col}>{renderSquare(0)}</View>
					<View style={styles.col}>{renderSquare(1)}</View>
					<View style={styles.col}>{renderSquare(2)}</View>
				</View>
				<View style={styles.row}>
					<View style={styles.col}>{renderSquare(3)}</View>
					<View style={styles.col}>{renderSquare(4)}</View>
					<View style={styles.col}>{renderSquare(5)}</View>
				</View>
				<View style={styles.row}>
					<View style={styles.col}>{renderSquare(6)}</View>
					<View style={styles.col}>{renderSquare(7)}</View>
					<View style={styles.col}>{renderSquare(8)}</View>
				</View>
			</View> 
			<TouchableOpacity style={styles.resetButton} onPress={resetGame}>
				<Text style={styles.resetButtonText}>Reset</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	header: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	board: {
		aspectRatio: 1,
	},
	row: {
		flexDirection: 'row',
	},
	col: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#fff',
	},
	square: {
		width: 100,
		height: 100,
		justifyContent: 'center',
		alignItems: 'center',
	},
	squareText: {
		fontSize: 48,
		fontWeight: 'bold',
		color: '#fff',
		textShadowColor: 'rgba(0, 0, 0, 0.2)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	zeroEffect: {
		textShadowColor: 'rgba(0, 0, 0, 0.4)',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 4,
	},
	lineContainer: {
		position: 'absolute',
		top: '50%',
		left: 0,
		right: 0,
		alignItems: 'center',
	},
	line: {
		width: '100%',
		height: 2,
		backgroundColor: 'red',
	},
	resetButton: {
		marginTop: 20,
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: 'lightblue',
		borderRadius: 4,
	},
	resetButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
	},
});

export default TicTacToeScreen;
