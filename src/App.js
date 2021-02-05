//See README.md for attribution
import "./App.css";
import { useState } from "react";
import "milligram";

function generateNumber() {
  let number = Math.floor(1 + Math.random() * 9);
  let prevNumber = [number];
  for (var i = 1; i < 4; i++) {
    let digit = Math.floor(1 + Math.random() * 9);
    while (prevNumber.includes(digit)) {
      digit = Math.floor(1 + Math.random() * 9);
    }
    number += Math.pow(10, i) * digit;
    prevNumber.push(digit);
  }
  return number;
}

function SubmitButton({ gameState, makeGuess }) {
  let button = null;
  if (gameState < 3) {
    button = (
      <button className="button" onClick={makeGuess}>
        Guess
      </button>
    );
  } else {
    button = (
      <button className="button" onClick={makeGuess} disabled>
        Guess
      </button>
    );
  }
  return <div className="column column-20">{button}</div>;
}

function App() {
  const [secret, _setsecret] = useState(generateNumber());
  const [guesses, setGuesses] = useState([]);
  const [text, setText] = useState("");
  const [gameState, setGameState] = useState(0);
  const listItems = guesses.map((guess) => (
    <p>
      {guess.text}-Cows:{guess.cows} Bulls:{guess.bulls}
    </p>
  ));

  let statusText = getStatus(gameState);

  function checkGuess() {
    let guess = { text: text, cows: 0, bulls: 0 };
    for (var i = 0; i < 4; i++) {
      if (text.toString().charAt(i) === secret.toString().charAt(i)) {
        guess.bulls += 1;
      } else if (secret.toString().indexOf(text.toString().charAt(i)) !== -1) {
        guess.cows += 1;
      }
    }
    return guess;
  }

  function validGuess() {
    if (text.length === 4) {
      let seen = "";
      for (const char of text) {
        if (seen.includes(char)) {
          return false;
        } else {
          seen += char;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  function getStatus(gameStatus) {
    if (gameStatus === 4){
      return "Correct! You have won the game."
    } else if (gameStatus === 3) {
      return "You have lost the game.";
    } else if (gameStatus === 2) {
      return "Invalid Guess. Please make sure that your guess is 4 unique digits.";
    } else if (gameStatus === 1) {
      return "Incorrect. Please make another guess.";
    } else {
      return "Please make a guess to start the game.";
    }
  }

  function makeGuess() {
    if (guesses.length > 7) {
      setGameState(3);
    } else {
      if (validGuess()) {
        const guess = checkGuess();
        if (guess.bulls === 4) {
          setGameState(4);
          setGuesses(guesses.concat([guess]));
          setText("");
        } else {
          setGameState(1);
          setGuesses(guesses.concat([guess]));
          setText("");
        }
      } else{
        setGameState(2);
      }
    }
  }

  function updateText(ev) {
    let vv = ev.target.value;
    setText(vv);
  }

  function keyPress(ev) {
    if (ev.key === "Enter") {
      makeGuess();
    }
  }

  function restartGame() {
    _setsecret(generateNumber());
    setGameState(0);
    setGuesses([]);
    setText("");
  }

  return (
    <div className="App">
      <h1>Bulls and Cows</h1>
      <p>{statusText}</p>
      <div className="row controls">
        <div className="column column-60">
          <input
            type="text"
            value={text}
            onChange={updateText}
            onKeyPress={keyPress}
          ></input>
        </div>
        <SubmitButton gameState={gameState} makeGuess={makeGuess} />
        <div className="column column-20">
          <button className="button button-outline" onClick={restartGame}>
            Restart Game
          </button>
        </div>
      </div>
      <div>{listItems}</div>
    </div>
  );
}

export default App;
