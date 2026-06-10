const UI = {
  chatBody: document.getElementById('chat-body'),
  score: document.getElementById('current-score'),
  input: document.getElementById('word-input'),
  sendBtn: document.getElementById('send-btn'),
  sendIcon: document.querySelector('.send-icon'),
  spinner: document.getElementById('loading-spinner'),
  form: document.getElementById('input-form'),
  progressLine: document.getElementById('progress-line'),
  gameOverScreen: document.getElementById('game-over-screen'),
  gameOverReason: document.getElementById('game-over-reason'),
  finalScore: document.getElementById('final-score-value'),
  highScore: document.getElementById('high-score-value'),
  btnPlayAgain: document.getElementById('btn-play-again'),
  btnShare: document.getElementById('btn-share'),
  menuBtn: document.getElementById('menu-btn'),
  menuScreen: document.getElementById('menu-screen'),
  closeMenuPlayBtn: document.getElementById('close-menu-play-btn'),
  statGames: document.getElementById('stat-games'),
  statBest: document.getElementById('stat-best'),
  statLongest: document.getElementById('stat-longest'),
  statFirstLetter: document.getElementById('stat-first-letter'),
  statLastLetter: document.getElementById('stat-last-letter')
};

let gameState = {
  score: 0,
  currentLetter: '',
  usedWords: new Set(),
  timer: null,
  timeLeft: 10000,
  timerInterval: null,
  isPlayerTurn: false,
  isPaused: false,
  knockoutLetter: '',
  waitingForFirstKeystroke: false
};

let stats = JSON.parse(localStorage.getItem('shiritordle_stats')) || {
  highScore: 0,
  gamesPlayed: 0,
  longestWord: '',
  hasSeenRules: false,
  firstLetters: {},
  lastLetters: {}
};

stats.firstLetters = stats.firstLetters || {};
stats.lastLetters = stats.lastLetters || {};

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'chirp') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'click') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'tick') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.05, now + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

document.body.addEventListener('click', initAudio, { once: true });
document.body.addEventListener('keydown', initAudio, { once: true });

function startTimer(duration = 10000) {
  UI.progressLine.style.transition = 'none';
  const percentage = (duration / 10000) * 100;
  UI.progressLine.style.width = percentage + '%';
  UI.progressLine.classList.remove('warning');

  void UI.progressLine.offsetWidth;

  UI.progressLine.style.transition = `width ${duration / 1000}s linear`;
  UI.progressLine.style.width = '0%';

  gameState.timeLeft = duration;
  const startTime = Date.now();

  gameState.timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const remaining = duration - elapsed;
    gameState.timeLeft = remaining;

    if (remaining <= 3000 && remaining > 0) {
      if (Math.floor(remaining / 1000) !== Math.floor((remaining + 100) / 1000)) {
        playSound('tick');
        UI.progressLine.classList.add('warning');
      }
    }

    if (remaining <= 0) {
      clearInterval(gameState.timerInterval);
      gameState.knockoutLetter = gameState.currentLetter.toUpperCase();
      endGame("You ran out of time!");
    }
  }, 100);
}

function stopTimer() {
  clearInterval(gameState.timerInterval);
  const computedWidth = window.getComputedStyle(UI.progressLine).width;
  UI.progressLine.style.transition = 'none';
  UI.progressLine.style.width = computedWidth;
}

function appendMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `message ${sender}-message`;
  div.textContent = text;
  UI.chatBody.appendChild(div);
  UI.chatBody.scrollTo({ top: UI.chatBody.scrollHeight, behavior: 'smooth' });
}

function showTypingIndicator() {
  const div = document.createElement('div');
  div.className = `message bot-message typing-container`;
  div.id = 'typing-indicator';
  div.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  UI.chatBody.appendChild(div);
  UI.chatBody.scrollTo({ top: UI.chatBody.scrollHeight, behavior: 'smooth' });
}

function removeTypingIndicator() {
  const ind = document.getElementById('typing-indicator');
  if (ind) ind.remove();
}

function setLoading(isLoading) {
  if (isLoading) {
    UI.input.disabled = true;
    UI.sendBtn.disabled = true;
    UI.sendIcon.style.display = 'none';
    UI.spinner.style.display = 'block';
  } else {
    UI.input.disabled = false;
    UI.sendBtn.disabled = false;
    UI.sendIcon.style.display = 'block';
    UI.spinner.style.display = 'none';
    UI.input.focus();
  }
}

async function botTurn(forcedWord = null) {
  setLoading(true);
  gameState.isPlayerTurn = false;

  let word = forcedWord;

  if (!word) {
    showTypingIndicator();
    await new Promise(r => setTimeout(r, 1000));

    try {
      const letter = gameState.currentLetter;
      const words = window.dictData && window.dictData[letter] ? window.dictData[letter] : [];

      const available = words.filter(w => !gameState.usedWords.has(w.toLowerCase()));
      if (available.length === 0) {
        removeTypingIndicator();
        endGame("The AI couldn't think of a word. You win!");
        return;
      }

      word = available[Math.floor(Math.random() * available.length)];
    } catch (e) {
      console.error(e);
      word = gameState.currentLetter + "pple";
    }
    removeTypingIndicator();
  }

  playSound('chirp');
  word = word.toUpperCase();
  gameState.usedWords.add(word.toLowerCase());

  let msgText = forcedWord ? `Hello! Let's play. My first word is: ${word}` : word;
  appendMessage(msgText, 'bot');

  gameState.currentLetter = word.slice(-1).toLowerCase();
  gameState.isPlayerTurn = true;
  UI.input.placeholder = `Type a word starting with '${word.slice(-1).toUpperCase()}'...`;
  setLoading(false);
  
  if (gameState.waitingForFirstKeystroke) {
    UI.progressLine.style.transition = 'none';
    UI.progressLine.style.width = '100%';
    gameState.timeLeft = 10000;
  } else {
    startTimer();
  }
}

UI.input.addEventListener('input', () => {
  if (gameState.isPlayerTurn && gameState.waitingForFirstKeystroke && UI.input.value.trim().length > 0) {
    gameState.waitingForFirstKeystroke = false;
    startTimer();
  }
});

UI.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!gameState.isPlayerTurn) return;

  const word = UI.input.value.trim().toLowerCase();
  if (!word) return;

  playSound('click');
  stopTimer();

  if (word.length === 1) {
    gameState.knockoutLetter = gameState.currentLetter.toUpperCase();
    endGame(`Single letters are not allowed!`);
    return;
  }

  if (word[0] !== gameState.currentLetter) {
    gameState.knockoutLetter = gameState.currentLetter.toUpperCase();
    endGame(`'${word.toUpperCase()}' does not start with '${gameState.currentLetter.toUpperCase()}'!`);
    return;
  }

  if (gameState.usedWords.has(word)) {
    gameState.knockoutLetter = gameState.currentLetter.toUpperCase();
    endGame(`'${word.toUpperCase()}' has already been used!`);
    return;
  }

  appendMessage(word.toUpperCase(), 'player');
  UI.input.value = '';
  setLoading(true);

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (res.status === 200) {
      gameState.score++;
      UI.score.textContent = gameState.score;
      gameState.usedWords.add(word);
      gameState.currentLetter = word.slice(-1).toLowerCase();

      if (word.length > stats.longestWord.length) {
        stats.longestWord = word;
      }

      const first = word[0];
      const last = word.slice(-1);
      stats.firstLetters = stats.firstLetters || {};
      stats.lastLetters = stats.lastLetters || {};
      stats.firstLetters[first] = (stats.firstLetters[first] || 0) + 1;
      stats.lastLetters[last] = (stats.lastLetters[last] || 0) + 1;
      localStorage.setItem('shiritordle_stats', JSON.stringify(stats));

      botTurn();
    } else {
      gameState.knockoutLetter = gameState.currentLetter.toUpperCase();
      endGame(`'${word.toUpperCase()}' is not a valid English word!`);
    }
  } catch (err) {
    endGame("Network error validating word!");
  }
});

UI.input.addEventListener('input', () => {
  if (UI.input.value.trim().length > 0) {
    UI.sendBtn.disabled = false;
  } else {
    UI.sendBtn.disabled = true;
  }
});

function endGame(reason) {
  gameState.isPlayerTurn = false;
  setLoading(true);

  stats.gamesPlayed++;
  if (gameState.score > stats.highScore) {
    stats.highScore = gameState.score;
  }
  localStorage.setItem('shiritordle_stats', JSON.stringify(stats));

  UI.gameOverReason.textContent = reason;
  UI.finalScore.textContent = gameState.score;
  UI.highScore.textContent = stats.highScore;

  setTimeout(() => {
    UI.gameOverScreen.style.display = 'flex';
  }, 500);
}

function initGame() {
  UI.chatBody.innerHTML = `
    <div class="message system-message">
      <p>Game started!
        Respond with a word starting with the last letter of the previous word.
        You have 10 seconds. Good luck!
      </p>
    </div>
  `;
  UI.gameOverScreen.style.display = 'none';
  gameState.score = 0;
  UI.score.textContent = '0';
  gameState.usedWords.clear();
  gameState.knockoutLetter = '';
  gameState.waitingForFirstKeystroke = true;
  UI.input.value = '';
  UI.sendBtn.disabled = true;

  let startWord = "APPLE";
  if (window.dictData) {
    const letters = Object.keys(window.dictData);
    if (letters.length > 0) {
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      const words = window.dictData[randomLetter];
      if (words && words.length > 0) {
        startWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
      }
    }
  }

  botTurn(startWord);
}

UI.btnPlayAgain.addEventListener('click', () => {
  playSound('click');
  initGame();
});

UI.btnShare.addEventListener('click', () => {
  playSound('click');
  const shareText = `🤖 Shiritordle - Word Chain Game
🏆 My Score: ${gameState.score} Words
💬 Longest Word: "${stats.longestWord || 'None'}"
❌ Knocked out on the letter '${gameState.knockoutLetter || '?'}'
🌐 Play at: shiritordle.pages.dev`;

  navigator.clipboard.writeText(shareText).then(() => {
    UI.btnShare.textContent = 'Copied!';
    setTimeout(() => {
      UI.btnShare.textContent = 'Share Score';
    }, 2000);
  });
});

function getFavLetter(letterObj) {
  let fav = '-';
  let max = 0;
  for (const [letter, count] of Object.entries(letterObj)) {
    if (count > max) {
      max = count;
      fav = letter.toUpperCase();
    }
  }
  return fav;
}

function updateMenuStats() {
  UI.statGames.textContent = stats.gamesPlayed;
  UI.statBest.textContent = stats.highScore;
  UI.statLongest.textContent = stats.longestWord ? `"${stats.longestWord.toUpperCase()}"` : '-';
  UI.statFirstLetter.textContent = getFavLetter(stats.firstLetters || {});
  UI.statLastLetter.textContent = getFavLetter(stats.lastLetters || {});
}

const menuMain = document.getElementById('menu-main');
const menuPanels = document.querySelectorAll('.menu-panel');
const menuNavBtns = document.querySelectorAll('.menu-nav-btn');
const menuBackBtns = document.querySelectorAll('.menu-back-btn');

function showMenuPanel(targetId) {
  menuMain.style.display = 'none';
  menuPanels.forEach(p => p.style.display = 'none');
  if (targetId) {
    document.getElementById(targetId).style.display = 'block';
  } else {
    menuMain.style.display = 'block';
  }
}

menuNavBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    playSound('click');
    showMenuPanel(e.target.dataset.target);
  });
});

menuBackBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    playSound('click');
    showMenuPanel(null);
  });
});

UI.menuBtn.addEventListener('click', () => {
  playSound('click');
  updateMenuStats();
  UI.menuScreen.style.display = 'flex';
  showMenuPanel(null);
  
  if (gameState.isPlayerTurn && !gameState.isPaused) {
    gameState.isPaused = true;
    clearInterval(gameState.timerInterval);
    const computedWidth = window.getComputedStyle(UI.progressLine).width;
    UI.progressLine.style.transition = 'none';
    UI.progressLine.style.width = computedWidth;
  }
});

function closeMenu() {
  playSound('click');
  UI.menuScreen.style.display = 'none';
  if (!stats.hasSeenRules) {
    stats.hasSeenRules = true;
    localStorage.setItem('shiritordle_stats', JSON.stringify(stats));
  }
  
  if (gameState.isPlayerTurn && gameState.isPaused) {
    gameState.isPaused = false;
    if (!gameState.waitingForFirstKeystroke) {
      startTimer(gameState.timeLeft);
    }
  }
}

UI.closeMenuPlayBtn.addEventListener('click', closeMenu);

UI.menuScreen.addEventListener('click', (e) => {
  if (e.target === UI.menuScreen) {
    closeMenu();
  }
});

initGame();

if (!stats.hasSeenRules) {
  updateMenuStats();
  UI.menuScreen.style.display = 'flex';
  showMenuPanel('menu-how-to');
}
