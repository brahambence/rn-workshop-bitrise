import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { maxLives, maxQuestions } from './config';
import { useQuiz } from './utils';
import { Game, EndGame } from './screens';

export default function App() {
  const { questions, reload, isLoading } = useQuiz();
  const [lives, setLives] = useState(maxLives);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isLifeLineUsed, setIsLifeLineUsed] = useState(false);

  const handleAnswerSelected = useCallback(
    (answer) => {
      const currentQuestion = questions[currentQuestionIndex];
      if (answer === currentQuestion.correct_answer) {
        setCurrentQuestionIndex((i) => i + 1);
      } else {
        setLives((l) => l - 1);
      }
    },
    [questions, currentQuestionIndex]
  );

  const handleResetGame = () => {
    setLives(maxLives);
    setCurrentQuestionIndex(0);
    setIsLifeLineUsed(false);
    reload();
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentQuestionIndex !== maxQuestions && lives > 0 && (
        <Game
          currentIndex={currentQuestionIndex}
          questions={questions}
          handleAnswerSelected={handleAnswerSelected}
          onResetGame={handleResetGame}
          isLoading={isLoading}
          lives={lives}
          isLifeLineUsed={isLifeLineUsed}
        />
      )}

      {(lives === 0 || currentQuestionIndex === maxQuestions) && (
        <EndGame
          onResetGame={handleResetGame}
          isGameOver={lives === 0}
          currentIndex={currentQuestionIndex}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
  },
});
