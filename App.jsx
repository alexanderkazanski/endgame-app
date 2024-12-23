import React, { createContext, useCallback, useEffect, useState } from "react"
import { languages } from "./languages"
import clsx from "clsx"
import Language from "./Language"
import Letter from "./Letter"
import RenderBanner from "./RenderBanner"
import Key from "./Key"
import { words } from "./words"

export const AssemblyContext = createContext({})

export default function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = useState(words.random);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)


  const wrongGuesses = useCallback(() => {
    return guessedLetters.filter(letter => {
      return !currentWord.includes(letter);
    })
  }, [guessedLetters]);

  const rightGuesses = useCallback(() => {
    return guessedLetters.filter(letter => {
      return currentWord.includes(letter);
    })
  }, [guessedLetters]);

  const wrongCount = wrongGuesses().length

  const isOver = wrongCount >= languages.length
  const won = rightGuesses().length === currentWord.length && wrongCount <= languages.length;


  function addGuessedLetter(letter) {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters(prevLetters => [...prevLetters, letter])
    }
  }

  function handleGameOverClick() {
    setGuessedLetters([])
    setCurrentWord(words.random);
  }


  return (
    <AssemblyContext.Provider value={{
      won,
      isOver,
      wrongCount,
      guessedLetters,
      currentWord,
      addGuessedLetter,
      languages
    }}>

      <main>
        <header>
          <h1>Assembly: Endgame</h1>
          <p>Guess the word within 8 attempts to keep the
            programming world safe from Assembly!</p>
        </header>
        <RenderBanner />
        <div className="languages">
          {languages.map((language, idx) => {
            return (
              <Language
                key={language.name + idx}
                idx={idx}
                {...language}
              />
            )
          })}
        </div>
        <div className="letters">
          {currentWord.split("").map((letter, idx) => {
            return <Letter
              key={letter + idx}
              letter={letter}
            />

          })}
        </div>
        <section className="sr-only" aria-live="polite" role="status">
          <p>
            {
              currentWord.split('').includes(lastGuessedLetter) ? 
                `Correct! The letter ${lastGuessedLetter} is in the word` : 
                `Sorry, the letter ${lastGuessedLetter} is not in the word`
            }
          </p>
          <p>Current Word: {
          currentWord.split("").map(
            letter => guessedLetters.includes(letter) ? letter : 'blank.').join(" ")
          }</p>
        </section>
        <div className="keyboard">
          {alphabet.split("").map((letter, idx) => {
            return <Key
              key={letter + idx}
              letter={letter}
            />

          })}
        </div>
        {(isOver === true) || (won === true) ? <button
          onClick={handleGameOverClick}
          type="button"
          className="new-game">
          New Game

        </button>
          : ''}
      </main>
    </AssemblyContext.Provider>
  )
}
