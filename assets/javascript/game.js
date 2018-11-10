// Once DOM is loaded do this stuff
document.onreadystatechange = function () {
  if (document.readyState === "interactive") {

    // Constants
    const AUDIO_ELE = document.getElementById('audio');
    const CURRENT_WORD_ELE = document.getElementById('current-word');
    const TURNS_REMAINING_ELE = document.getElementById('turns-remaining');
    const AUDIO_SRC_ELE = document.getElementById('audio-src');
    const WORD_COUNT_ELE = document.getElementById('word-count');
    const LETTERS_GUESSED_ELE = document.getElementById('letters-guessed');
    const INSTRUCTIONS_ELE = document.getElementById('instructions');
    const CARD_ELE = document.getElementById('card');

    // Variables to hold data
    let wordArray = [
      'Sonic The Hedgehog',
      'Banjo Kazooie',
      'Donkey Kong',
      'Super Mario Bros',
      'Fallout',
      'Super Smash Bros',
      'Read Dead Redemption',
      'Fortnite',
      'Pokemon',
      'Tetris',
      'Pacman',
      'StarCraft'
    ];

    let soundPathArray = [
      [ //game over sounds
        './assets/audio/smb3_game_over.wav',
        './assets/audio/smb3_hurry_up.wav',
        './assets/audio/smb3_player_down.wav',
        './assets/audio/smb3_thwomp.wav'
      ],[ //win sounds
        './assets/audio/smb3_fortress_clear.wav',
        './assets/audio/smb3_airship_clear.wav',
        './assets/audio/smb3_level_clear.wav'
      ]
    ]
    let turnsRemaining = 10;
    let randomIndex;
    let currentWord;
    let wordOnScreen = [];
    let lettersGuessed = [];
    let wordsGuessed = 0;

    function newWord() {
      randomIndex = Math.floor(Math.random() * wordArray.length);
      currentWord = wordArray[randomIndex].toLowerCase().split('');
      turnsRemaining = 10;
      lettersGuessed = [];
      wordOnScreen = [];


      // Change display to a bunch of '-'
      for (let i = 0; i < currentWord.length; i++) {
        if (currentWord[i].match(/[\s]/) ) {
          wordOnScreen.push(' ');
        } else {
          wordOnScreen.push('-');
        }
      }
      CURRENT_WORD_ELE.textContent = wordOnScreen.join('');
      TURNS_REMAINING_ELE.textContent = turnsRemaining;
      LETTERS_GUESSED_ELE.textContent = lettersGuessed.toString();
    }

    // invokes new round first time through code
    newWord();

    // Key listener
    document.addEventListener('keyup', function(event) {
      INSTRUCTIONS_ELE.style.display = 'none';
      CARD_ELE.style.marginTop = '50px';
      if(updateLettersGuessed(event.key)) {
        // only gets called if new letter

        let letterIndex = 0;
        let getLetterCorrect = false;
        while (letterIndex !== -1) {
          // if letter exists first look through, getLC = true
          if (letterIndex === 0) {
            letterIndex = currentWord.indexOf(event.key, letterIndex);
            if (letterIndex !== -1) {
              getLetterCorrect = true;
            }
          } else {
            letterIndex = currentWord.indexOf(event.key, letterIndex);
          }

          // only decreases turns if letter wasn't in word
          if (letterIndex === -1) {
            if (!getLetterCorrect) {
              turnsRemaining--;
              if (turnsRemaining <= 0) {
                let soundIndex = Math.floor(Math.random() * soundPathArray[0].length);
                AUDIO_SRC_ELE.src = soundPathArray[0][soundIndex];
                AUDIO_ELE.load();
                AUDIO_ELE.play();
                alert('Game Over!\nScore: ' + wordsGuessed);
                INSTRUCTIONS_ELE.style.display = 'block';
                CARD_ELE.style.marginTop = '0px';
                wordsGuessed = 0;
                newWord();
                WORD_COUNT_ELE.textContent = wordsGuessed;
                return;
              }
            }
            TURNS_REMAINING_ELE.textContent = turnsRemaining;
            break;
          }
          wordOnScreen[letterIndex] = event.key;
          CURRENT_WORD_ELE.textContent = wordOnScreen.join('');
          letterIndex++;
        }
        checkForWin();
      }
    });

    // Checks if 1, lowercase char, & not used yet
    function updateLettersGuessed(letter) {
      if (letter.length === 1 && letter.match(/[a-z]/) && lettersGuessed.indexOf(letter) === -1) {
        lettersGuessed.push(letter);
        LETTERS_GUESSED_ELE.textContent = lettersGuessed.toString().toUpperCase();
        return true;
      } else {
        return false;
      }
    }

    function checkForWin() {
      // console.log(currentWord);
      // console.log(wordOnScreen);

      if (currentWord.toString() === wordOnScreen.toString()) {
        let soundIndex = Math.floor(Math.random() * soundPathArray[1].length);
        AUDIO_SRC_ELE.src = soundPathArray[1][soundIndex];
        AUDIO_ELE.load();
        AUDIO_ELE.play();
        alert('You win!');
        newWord();
        wordsGuessed++;
        WORD_COUNT_ELE.textContent = wordsGuessed;
      }
    }

  } else {
    console.log('Something went wrong with doc.readyState/NOT READY');
  }
}
