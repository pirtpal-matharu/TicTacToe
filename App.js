import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

const TicTacToeScreen = () => {
	const [board, setBoard] = useState(Array(9).fill(null));
	const [currentPlayer, setCurrentPlayer] = useState('X');
	const [isWinner, setIsWinner] = useState(null);
	const [pageLoader, setPageLoader] = useState(true);
	const [winnerScreenAnim] = useState(new Animated.Value(0));

	useEffect(() => {
		setTimeout(() => {
			setPageLoader(false)
		}, 3000);
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
			const nonNullCount = newBoard.filter((value) => value !== null).length;
			if (isMatched || nonNullCount == 9) {
				setIsWinner(nonNullCount == 9 ? 'draw' : currentPlayer)
				animateWinnerScreen();
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

	const animateWinnerScreen = () => { 
		Animated.timing(winnerScreenAnim, {
			toValue: 1,
			duration: 1000,
			easing: Easing.bounce,
			useNativeDriver: true,
		}).start();
	};


	if (pageLoader) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
				<LottieView
					source={require("./assets/json/67313-lava-preloader.json")}
					style={{
						width: 100,
						height: 100,
					}}
					autoPlay/>
			</View>
		);
	}

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tic Tac Toe</Text>
			<View style={styles.board}>{renderBoard()}</View>
			

			{
				isWinner ? 
					<Animated.View style={[styles.winnerScreen, {
						transform: [{
							translateY: winnerScreenAnim.interpolate({
								inputRange: [0, 1],
								outputRange: [100, 0],
							})
						}]
					}]}>
						<LottieView
							loop
							autoPlay
							style={styles.waterFlowAnimation}
							source={require('./assets/json/waterFlow.json')}
						/>
						<Text style={styles.winnerText}>{isWinner === 'draw' ? "It's a Draw!" : `Congratulations! ${isWinner} Win!`}</Text>
						<TouchableOpacity style={styles.resetButton} onPress={resetGame}>
							<Text style={styles.resetButtonText}>Play Again</Text>
						</TouchableOpacity>
					</Animated.View>
				:
					<Text style={[styles.winnerText,{marginTop:20}]}>{currentPlayer} Is Turn</Text>
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
		marginBottom: 60,
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
		alignItems: 'center',
		paddingBottom: 40,
		backgroundColor: '#fff9',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		elevation: 5,
	},
	waterFlowAnimation: {
		width: 200,
		height: 400,
	},
	winnerText: {
		fontSize: 24,
		fontWeight: 'bold', 
	},
});

export default TicTacToeScreen;