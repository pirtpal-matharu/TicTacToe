import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import * as Animatable from 'react-native-animatable';

const TicTacToeScreen = () => {
	const [board, setBoard] = useState(Array(9).fill(null));
	const [currentPlayer, setCurrentPlayer] = useState('X');
	const [isWinner, setIsWinner] = useState(null);
	const [winnerScreenAnim] = useState(new Animated.Value(0));

	useEffect(() => {
		resetGame();
	}, []);

  const handleSquarePress = (index) => {
    if (board[index] === null) {
			const newBoard = [...board];
			newBoard[index] = currentPlayer;
			setBoard(newBoard);
			setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

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
			const indices = newBoard.map((element, index) => (element === currentPlayer ? index : null)).filter((index) => index !== null);
			const isMatched = winningCombinations.some(combination => combination.every(index => indices.includes(index)));
			console.log({ indices, isMatched });
			if (isMatched) {
				setIsWinner(currentPlayer)
				animateWinnerScreen();

				alert(`${currentPlayer} Winner.`)
				return currentPlayer
			}
    }
  };

  const renderSquare = (index) => {
    return (
			<TouchableOpacity
				key={index}
        style={styles.square}
        onPress={() => handleSquarePress(index)}
				disabled={board[index] !== null || isWinner}>
        {board[index] && (<Animatable.Text animation="jello"  style={styles.squareText}>{board[index]}</Animatable.Text>)}
      </TouchableOpacity>
    );
  };

  const renderBoard = () => {
    return Array(3).fill(null).map((_, row) => (
			<View key={row} style={styles.row}>
				{Array(3).fill(null).map((_, col) => renderSquare(row * 3 + col))}
			</View>
		));
  };


	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setCurrentPlayer('X');
		setIsWinner(null);
		winnerScreenAnim.setValue(0);
	};

	const winnerScreenStyles = [
		styles.winnerScreen,
		{
			transform: [
				{
					translateY: winnerScreenAnim.interpolate({
						inputRange: [0, 1],
						outputRange: [500, 0], // Adjust the values as needed
					}),
				},
			],
			opacity: winnerScreenAnim,
		},
	];

	const animateWinnerScreen = () => { 
		Animated.timing(winnerScreenAnim, {
			toValue: 1,
			duration: 1000,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start();
	};


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tic Tac Toe</Text>
			<View style={styles.board}>{renderBoard()}</View>

			{
				isWinner && (
					<Animated.View style={winnerScreenStyles}>
						<Text style={styles.winnerText}>{isWinner === 'draw' ? "It's a Draw!" : `Winner: ${isWinner}`}</Text>
						<TouchableOpacity style={styles.resetButton} onPress={resetGame}>
							<Text style={styles.resetButtonText}>Reset</Text>
						</TouchableOpacity>
					</Animated.View>
				)
			}
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
		borderWidth: .5,
		borderColor: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: .5,
    borderColor: '#333',
		backgroundColor: '#fff',
		width: 100,
		height: 100
  },
  squareText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#333',
	},
	resetButton: {
		marginTop: 20,
		paddingHorizontal: 16,
		paddingVertical: 8,
		backgroundColor: '#000',
		borderRadius: 4,
	},
	resetButtonText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: 'white',
	},
	winnerScreen: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: '100%',
		backgroundColor: '#333',
		alignItems: 'center',
		justifyContent: 'center',
	},
	winnerText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'red',
	},
});

export default TicTacToeScreen;