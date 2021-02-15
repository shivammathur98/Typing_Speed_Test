function randomWords() {
  fetch('https://random-word-api.herokuapp.com/word?number=5')
    .then((response) => response.json())
    .then((data) => {
      let rword = `${data}`;
      var newrword = rword.replace(/,/g, ' ');
      return words_array.push(newrword);
    });
}
// Selectors
let TIME_LIMIT = 60;
let words_array = ['Czechoslovakia'];
let timer_text = document.querySelector('.curr_time');
let accuracy_text = document.querySelector('.curr_accuracy');
let error_text = document.querySelector('.curr_errors');
let wpm_text = document.querySelector('.curr_wpm');
let words_text = document.querySelector('.words');
let input_area = document.querySelector('.input_area');
let restart_btn = document.querySelector('.restart_btn');
let wpm_group = document.querySelector('.wpm');
let error_group = document.querySelector('.errors');
let accuracy_group = document.querySelector('.accuracy');
let timeLeft = TIME_LIMIT;
let timeElapsed = 0;
let total_errors = 0;
let errors = 0;
let accuracy = 0;
let characterTyped = 0;
let current_words = '';
let wordNo = 0;
let timer = null;
function updateQuote() {
  words_text.textContent = null;
  current_words = words_array[wordNo];
  wordNo++;
  randomWords();
  // separate each character and make an element
  // out of each of them to individually style them
  current_words.split('').forEach((char) => {
    const charSpan = document.createElement('span');
    charSpan.innerText = char;
    words_text.appendChild(charSpan);
  });
}
function processCurrentText() {
  // get current input text and split it
  curr_input = input_area.value;
  curr_input_array = curr_input.split('');
  // increment total characters typed
  characterTyped++;
  errors = 0;
  quoteSpanArray = words_text.querySelectorAll('span');
  quoteSpanArray.forEach((char, index) => {
    let typedChar = curr_input_array[index];
    // characters not currently typed
    if (typedChar == null) {
      char.classList.remove('correct_char');
      char.classList.remove('incorrect_char');
      // correct characters
    } else if (typedChar === char.innerText) {
      char.classList.add('correct_char');
      char.classList.remove('incorrect_char');
      // incorrect characters
    } else {
      char.classList.add('incorrect_char');
      char.classList.remove('correct_char');
      // increment number of errors
      errors++;
    }
  });
  // display the number of errors
  error_text.textContent = total_errors + errors;
  // update accuracy text
  let correctCharacters = characterTyped - (total_errors + errors);
  let accuracyVal = (correctCharacters / characterTyped) * 100;
  accuracy_text.textContent = Math.round(accuracyVal);
  // if current text is completely typed
  // irrespective of errors
  if (curr_input.length >= current_words.length) {
    updateQuote();
    // update total errors
    total_errors += errors;
    // clear the input area
    input_area.value = '';
  }
}
function updateTimer() {
  if (timeLeft > 0) {
    // decrease the current time left
    timeLeft--;
    // increase the time elapsed
    timeElapsed++;
    // update the timer text
    timer_text.textContent = timeLeft + 's';
    if (timeLeft < 6) {
      timer_text.classList.add('end');
    }
  } else {
    // finish the game
    finishGame();
  }
}
function finishGame() {
  // stop the timer
  clearInterval(timer);
  // disable the input area
  input_area.disabled = true;
  input_area.value = '';
  timer_text.classList.remove('end');
  // display restart button
  restart_btn.style.display = 'block';
  // calculate wpm
  wpm = Math.round((characterTyped / 5 / timeElapsed) * 60);
  if (wpm > 30) {
    words_text.textContent =
      'Great job, keep practising ' + String.fromCodePoint(0x1f929);
  } else {
    words_text.textContent =
      'You need to work hard buddy ' + String.fromCodePoint(0x1f605);
  }
  // update wpm text
  wpm_text.textContent = wpm;
  // display the wpm
  wpm_group.style.display = 'block';
}
function startGame() {
  resetValues();
  updateQuote();
  // clear old and start a new timer
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}
function resetValues() {
  timeLeft = TIME_LIMIT;
  timeElapsed = 0;
  errors = 0;
  total_errors = 0;
  accuracy = 0;
  characterTyped = 0;
  input_area.disabled = false;
  input_area.value = '';
  words_text.textContent =
    'Click the plank to retake the test' + String.fromCodePoint(0x1f447);
  accuracy_text.textContent = 100;
  timer_text.textContent = timeLeft + 's';
  error_text.textContent = 0;
  restart_btn.style.display = 'none';
  wpm_group.style.display = 'none';
}
