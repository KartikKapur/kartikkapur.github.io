// ===== DEFAULT GAME DATA =====
const defaultGameData = {
  questions: [
    {
      id: 1,
      question: "Name something people often promise to organize but rarely finish.",
      answers: [
        { text: "Closet", points: 30 },
        { text: "Garage", points: 25 },
        { text: "Photos", points: 20 },
        { text: "Emails", points: 13 },
        { text: "Digital files", points: 8 },
        { text: "Desk", points: 4 }
      ]
    },
    {
      id: 2,
      question: "Name something you instantly check when you wake up.",
      answers: [
        { text: "Phone", points: 38 },
        { text: "Time/Clock", points: 23 },
        { text: "Weather", points: 17 },
        { text: "Social Media", points: 10 },
        { text: "News", points: 7 },
        { text: "Messages", points: 5 }
      ]
    },
    {
      id: 3,
      question: "Name something people try to fix themselves instead of hiring a professional.",
      answers: [
        { text: "Leaky faucet", points: 29 },
        { text: "Computer/Tech issues", points: 23 },
        { text: "Toilet/plumbing", points: 18 },
        { text: "Car problems", points: 15 },
        { text: "Painting", points: 10 },
        { text: "Electrical work", points: 5 }
      ]
    },
    {
      id: 4,
      question: "Name something people bring on every vacation, even if they don't use it.",
      answers: [
        { text: "Camera", points: 33 },
        { text: "Book", points: 26 },
        { text: "Extra shoes", points: 19 },
        { text: "Snacks", points: 12 },
        { text: "Umbrella", points: 7 },
        { text: "Swimsuit", points: 3 }
      ]
    },
    {
      id: 5,
      question: "Name something people always forget when leaving the house.",
      answers: [
        { text: "Keys", points: 36 },
        { text: "Phone", points: 26 },
        { text: "Wallet", points: 19 },
        { text: "Sunglasses", points: 9 },
        { text: "Reusable bags", points: 6 },
        { text: "Water bottle", points: 4 }
      ]
    }
  ]
};

// Active game data (can be default or custom)
let gameData = defaultGameData;

// Utility: Shuffle array
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Game State
let gameState = {
  currentPlayer: 1,
  currentQuestion: 0,
  player1Answers: [], // Array of {questionIndex, answerIndex, text, points}
  player2Answers: [], // Array of {questionIndex, answerIndex, text, points}
  player1Score: 0,
  player2Score: 0
};

// Utility Functions
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// Game Flow Functions
function startGame() {
  // DON'T shuffle questions - keep in original order
  // DO shuffle answers once per game - same order for both players
  
  gameState = {
    currentPlayer: 1,
    currentQuestion: 0,
    player1Answers: [],
    player2Answers: [],
    player1Score: 0,
    player2Score: 0,
    answerOrders: {} // Store shuffled answer indices for each question
  };
  
  // Create shuffled answer order for each question
  gameData.questions.forEach((question, qIndex) => {
    // Create array of indices [0, 1, 2, 3, 4, 5]
    const indices = question.answers.map((_, i) => i);
    // Shuffle the indices
    gameState.answerOrders[qIndex] = shuffle(indices);
  });
  
  showScreen('player1-screen');
  displayPlayer1Question();
}

function displayPlayer1Question() {
  const questionNum = gameState.currentQuestion + 1;
  const question = gameData.questions[gameState.currentQuestion];
  
  document.getElementById('p1-question-num').textContent = questionNum;
  document.getElementById('p1-question').textContent = question.question;
  
  // Get shuffled answer order for this question
  const shuffledIndices = gameState.answerOrders[gameState.currentQuestion];
  
  // Create answer buttons in shuffled order
  const buttonsContainer = document.getElementById('p1-answer-buttons');
  buttonsContainer.innerHTML = '';
  
  shuffledIndices.forEach((originalIndex, buttonPosition) => {
    const answer = question.answers[originalIndex];
    const button = document.createElement('button');
    button.className = 'answer-btn player1-btn';
    button.innerHTML = `
      <span class="answer-text">${answer.text}</span>
    `;
    button.onclick = () => selectPlayer1Answer(originalIndex, buttonPosition);
    buttonsContainer.appendChild(button);
  });
  
  // Add "No Match" button
  const noMatchButton = document.createElement('button');
  noMatchButton.className = 'answer-btn player1-btn no-match';
  noMatchButton.innerHTML = `
    <span class="answer-text">No Match</span>
  `;
  noMatchButton.onclick = () => selectPlayer1Answer(question.answers.length, shuffledIndices.length);
  buttonsContainer.appendChild(noMatchButton);
}

function selectPlayer1Answer(answerIndex, buttonPosition) {
  const question = gameData.questions[gameState.currentQuestion];
  
  // Check if "No Match" was selected
  let selectedAnswer;
  if (answerIndex >= question.answers.length) {
    selectedAnswer = { text: "No Match", points: 0 };
  } else {
    selectedAnswer = question.answers[answerIndex];
  }
  
  // Store the answer with all details
  gameState.player1Answers.push({
    questionIndex: gameState.currentQuestion,
    answerIndex: answerIndex,
    text: selectedAnswer.text,
    points: selectedAnswer.points
  });
  
  // Add visual feedback - use buttonPosition to highlight the exact button clicked
  const buttons = document.querySelectorAll('#p1-answer-buttons .answer-btn');
  buttons.forEach(btn => btn.disabled = true);
  buttons[buttonPosition].classList.add('clicked');
  
  // AUTO-ADVANCE: Move to next question or results after a short delay
  setTimeout(() => {
    gameState.currentQuestion++;
    
    if (gameState.currentQuestion < gameData.questions.length) {
      // More questions - show next question
      displayPlayer1Question();
    } else {
      // All questions answered - show results
      showPlayer1Results();
    }
  }, 600);
}

// This function is no longer needed with auto-advance
function proceedPlayer1() {
  // Kept for compatibility but not used
}

function showPlayer1Results() {
  showScreen('player1-results-screen');
  
  // Calculate Player 1 total score
  gameState.player1Score = gameState.player1Answers.reduce((sum, answer) => sum + answer.points, 0);
  
  const resultsContainer = document.getElementById('p1-results-items');
  resultsContainer.innerHTML = '';
  
  // Progressive reveal state with 3 steps per question
  let currentRevealIndex = 0;
  let revealStep = 0; // 0 = show question, 1 = show answer, 2 = show points
  let runningTotal = 0;
  
  // Create running total display
  const runningTotalDiv = document.createElement('div');
  runningTotalDiv.id = 'p1-running-total';
  runningTotalDiv.className = 'running-total';
  runningTotalDiv.style.display = 'none';
  runningTotalDiv.innerHTML = `
    <div class="running-total-label">Running Total:</div>
    <div class="running-total-value" id="p1-running-value">0</div>
  `;
  resultsContainer.appendChild(runningTotalDiv);
  
  // Create main reveal button
  const mainRevealBtn = document.createElement('button');
  mainRevealBtn.className = 'btn-primary';
  mainRevealBtn.textContent = 'Start Reveal';
  mainRevealBtn.style.marginTop = '20px';
  resultsContainer.appendChild(mainRevealBtn);
  
  // Current question display container
  const currentQuestionDiv = document.createElement('div');
  currentQuestionDiv.id = 'p1-current-reveal';
  resultsContainer.insertBefore(currentQuestionDiv, mainRevealBtn);
  
  mainRevealBtn.onclick = () => {
    if (currentRevealIndex >= gameState.player1Answers.length) {
      // All revealed - show total and continue
      mainRevealBtn.style.display = 'none';
      document.getElementById('p1-total-value').textContent = gameState.player1Score;
      document.getElementById('p1-total-container').style.display = 'block';
      document.getElementById('p1-continue-btn').style.display = 'block';
      return;
    }
    
    const answer = gameState.player1Answers[currentRevealIndex];
    const question = gameData.questions[answer.questionIndex];
    
    if (revealStep === 0) {
      // Step 1: Show question text only
      currentQuestionDiv.innerHTML = `
        <div class="reveal-item" style="animation-delay: 0s;">
          <div class="reveal-question">Q${currentRevealIndex + 1}: ${question.question}</div>
        </div>
      `;
      
      revealStep = 1;
      mainRevealBtn.textContent = 'Show Answer';
      
      // Show running total on first question
      if (currentRevealIndex === 0) {
        document.getElementById('p1-running-total').style.display = 'block';
      }
    } else if (revealStep === 1) {
      // Step 2: Show player's answer (points still hidden)
      currentQuestionDiv.innerHTML = `
        <div class="reveal-item" style="animation-delay: 0s;">
          <div class="reveal-question">Q${currentRevealIndex + 1}: ${question.question}</div>
          <div class="reveal-answer-row">
            <div class="reveal-answer-info">
              <span class="reveal-answer-text">${answer.text}</span>
              <span class="reveal-points hidden" id="p1-current-points">+${answer.points}</span>
            </div>
          </div>
        </div>
      `;
      
      revealStep = 2;
      mainRevealBtn.textContent = 'Show Points';
    } else if (revealStep === 2) {
      // Step 3: Reveal points for current question
      const pointsEl = document.getElementById('p1-current-points');
      pointsEl.classList.remove('hidden');
      pointsEl.classList.add('revealed');
      
      runningTotal += answer.points;
      document.getElementById('p1-running-value').textContent = runningTotal;
      
      currentRevealIndex++;
      revealStep = 0;
      
      if (currentRevealIndex < gameState.player1Answers.length) {
        mainRevealBtn.textContent = 'Next Question';
      } else {
        mainRevealBtn.textContent = 'Show Total';
      }
    }
  };
  
  // Hide total score and continue button initially
  document.getElementById('p1-total-container').style.display = 'none';
  document.getElementById('p1-continue-btn').style.display = 'none';
}

// This function is no longer needed - all results shown at once
function showNextPlayer1Reveal() {
  // Kept for compatibility but not used
}

function continueToPlayer2() {
  document.getElementById('p1-continue-btn').style.display = 'none';
  document.getElementById('transition-p1-score').textContent = gameState.player1Score;
  showScreen('transition-screen');
}

function startPlayer2() {
  gameState.currentPlayer = 2;
  gameState.currentQuestion = 0;
  showScreen('player2-screen');
  displayPlayer2Question();
}

function displayPlayer2Question() {
  const questionNum = gameState.currentQuestion + 1;
  const question = gameData.questions[gameState.currentQuestion];
  
  document.getElementById('p2-question-num').textContent = questionNum;
  document.getElementById('p2-question').textContent = question.question;
  
  // Get Player 1's answer for this question
  const player1Answer = gameState.player1Answers.find(a => a.questionIndex === gameState.currentQuestion);
  const player1AnswerIndex = player1Answer ? player1Answer.answerIndex : -1;
  
  // Get shuffled answer order for this question (same as Player 1)
  const shuffledIndices = gameState.answerOrders[gameState.currentQuestion];
  
  // Create answer buttons in same shuffled order as Player 1
  const buttonsContainer = document.getElementById('p2-answer-buttons');
  buttonsContainer.innerHTML = '';
  
  shuffledIndices.forEach((originalIndex, buttonPosition) => {
    const answer = question.answers[originalIndex];
    const button = document.createElement('button');
    button.className = 'answer-btn player2-btn';
    button.innerHTML = `
      <span class="answer-text">${answer.text}</span>
    `;
    
    // Disable if Player 1 picked this answer
    if (originalIndex === player1AnswerIndex) {
      button.disabled = true;
    } else {
      button.onclick = () => selectPlayer2Answer(originalIndex, buttonPosition);
    }
    
    buttonsContainer.appendChild(button);
  });
  
  // Add "No Match" button
  const noMatchButton = document.createElement('button');
  noMatchButton.className = 'answer-btn player2-btn no-match';
  noMatchButton.innerHTML = `
    <span class="answer-text">No Match</span>
  `;
  // Disable if Player 1 picked "No Match"
  if (player1AnswerIndex >= question.answers.length) {
    noMatchButton.disabled = true;
  } else {
    noMatchButton.onclick = () => selectPlayer2Answer(question.answers.length, shuffledIndices.length);
  }
  buttonsContainer.appendChild(noMatchButton);
}

function selectPlayer2Answer(answerIndex, buttonPosition) {
  const question = gameData.questions[gameState.currentQuestion];
  
  // Check if "No Match" was selected
  let selectedAnswer;
  if (answerIndex >= question.answers.length) {
    selectedAnswer = { text: "No Match", points: 0 };
  } else {
    selectedAnswer = question.answers[answerIndex];
  }
  
  // Store the answer with all details
  gameState.player2Answers.push({
    questionIndex: gameState.currentQuestion,
    answerIndex: answerIndex,
    text: selectedAnswer.text,
    points: selectedAnswer.points
  });
  
  // Add visual feedback - use buttonPosition to highlight the exact button clicked
  const buttons = document.querySelectorAll('#p2-answer-buttons .answer-btn');
  buttons.forEach(btn => btn.disabled = true);
  buttons[buttonPosition].classList.add('clicked');
  
  // AUTO-ADVANCE: Move to next question or results after a short delay
  setTimeout(() => {
    gameState.currentQuestion++;
    
    if (gameState.currentQuestion < gameData.questions.length) {
      // More questions - show next question
      displayPlayer2Question();
    } else {
      // All questions answered - show results
      showPlayer2Results();
    }
  }, 600);
}

// This function is no longer needed with auto-advance
function proceedPlayer2() {
  // Kept for compatibility but not used
}

function showPlayer2Results() {
  showScreen('player2-results-screen');
  
  // Calculate Player 2 total score
  gameState.player2Score = gameState.player2Answers.reduce((sum, answer) => sum + answer.points, 0);
  
  const resultsContainer = document.getElementById('p2-results-items');
  resultsContainer.innerHTML = '';
  
  // Progressive reveal state with 3 steps per question
  let currentRevealIndex = 0;
  let revealStep = 0; // 0 = show question, 1 = show answer, 2 = show points
  let runningTotal = 0;
  
  // Create running total display
  const runningTotalDiv = document.createElement('div');
  runningTotalDiv.id = 'p2-running-total';
  runningTotalDiv.className = 'running-total';
  runningTotalDiv.style.display = 'none';
  runningTotalDiv.innerHTML = `
    <div class="running-total-label">Running Total:</div>
    <div class="running-total-value" id="p2-running-value">0</div>
  `;
  resultsContainer.appendChild(runningTotalDiv);
  
  // Create main reveal button
  const mainRevealBtn = document.createElement('button');
  mainRevealBtn.className = 'btn-primary';
  mainRevealBtn.textContent = 'Start Reveal';
  mainRevealBtn.style.marginTop = '20px';
  resultsContainer.appendChild(mainRevealBtn);
  
  // Current question display container
  const currentQuestionDiv = document.createElement('div');
  currentQuestionDiv.id = 'p2-current-reveal';
  resultsContainer.insertBefore(currentQuestionDiv, mainRevealBtn);
  
  mainRevealBtn.onclick = () => {
    if (currentRevealIndex >= gameState.player2Answers.length) {
      // All revealed - show total and continue
      mainRevealBtn.style.display = 'none';
      document.getElementById('p2-total-value').textContent = gameState.player2Score;
      document.getElementById('p2-total-container').style.display = 'block';
      document.getElementById('p2-continue-btn').style.display = 'block';
      return;
    }
    
    const answer = gameState.player2Answers[currentRevealIndex];
    const question = gameData.questions[answer.questionIndex];
    
    if (revealStep === 0) {
      // Step 1: Show question text only
      currentQuestionDiv.innerHTML = `
        <div class="reveal-item" style="animation-delay: 0s;">
          <div class="reveal-question">Q${currentRevealIndex + 1}: ${question.question}</div>
        </div>
      `;
      
      revealStep = 1;
      mainRevealBtn.textContent = 'Show Answer';
      
      // Show running total on first question
      if (currentRevealIndex === 0) {
        document.getElementById('p2-running-total').style.display = 'block';
      }
    } else if (revealStep === 1) {
      // Step 2: Show player's answer (points still hidden)
      currentQuestionDiv.innerHTML = `
        <div class="reveal-item" style="animation-delay: 0s;">
          <div class="reveal-question">Q${currentRevealIndex + 1}: ${question.question}</div>
          <div class="reveal-answer-row">
            <div class="reveal-answer-info">
              <span class="reveal-answer-text">${answer.text}</span>
              <span class="reveal-points hidden" id="p2-current-points">+${answer.points}</span>
            </div>
          </div>
        </div>
      `;
      
      revealStep = 2;
      mainRevealBtn.textContent = 'Show Points';
    } else if (revealStep === 2) {
      // Step 3: Reveal points for current question
      const pointsEl = document.getElementById('p2-current-points');
      pointsEl.classList.remove('hidden');
      pointsEl.classList.add('revealed');
      
      runningTotal += answer.points;
      document.getElementById('p2-running-value').textContent = runningTotal;
      
      currentRevealIndex++;
      revealStep = 0;
      
      if (currentRevealIndex < gameState.player2Answers.length) {
        mainRevealBtn.textContent = 'Next Question';
      } else {
        mainRevealBtn.textContent = 'Show Total';
      }
    }
  };
  
  // Hide total score and continue button initially
  document.getElementById('p2-total-container').style.display = 'none';
  document.getElementById('p2-continue-btn').style.display = 'none';
}

// This function is no longer needed - all results shown at once
function showNextPlayer2Reveal() {
  // Kept for compatibility but not used
}

function showCombinedResults() {
  showScreen('combined-results-screen');
  
  document.getElementById('p1-combined-score').textContent = gameState.player1Score;
  document.getElementById('p2-combined-score').textContent = gameState.player2Score;
  
  const totalScore = gameState.player1Score + gameState.player2Score;
  document.getElementById('combined-total-score').textContent = totalScore;
  
  const winStatus = document.getElementById('win-status');
  if (totalScore >= 200) {
    winStatus.textContent = '🎉 YOU WIN! 200+ POINTS! 🎉';
    winStatus.className = 'win-status winning';
  } else {
    winStatus.textContent = `😅 ${200 - totalScore} points away from winning!`;
    winStatus.className = 'win-status losing';
  }
}

function showTopAnswers() {
  showScreen('top-answers-screen');
  
  const topAnswersList = document.getElementById('top-answers-list');
  topAnswersList.innerHTML = '';
  
  // Display all questions with their top answers
  gameData.questions.forEach((question, qIndex) => {
    const questionBlock = document.createElement('div');
    questionBlock.className = 'top-answer-question-block';
    
    const questionTitle = document.createElement('div');
    questionTitle.className = 'top-answer-question-title';
    questionTitle.textContent = `Q${qIndex + 1}: ${question.question}`;
    questionBlock.appendChild(questionTitle);
    
    const answersGrid = document.createElement('div');
    answersGrid.className = 'top-answer-answers-grid';
    
    // Display all answers sorted by points (descending)
    question.answers.forEach((answer, aIndex) => {
      const answerItem = document.createElement('div');
      answerItem.className = 'top-answer-item';
      answerItem.innerHTML = `
        <span class="top-answer-rank">${aIndex + 1}.</span>
        <span class="top-answer-text">${answer.text}</span>
        <span class="top-answer-points">${answer.points} pts</span>
      `;
      answersGrid.appendChild(answerItem);
    });
    
    questionBlock.appendChild(answersGrid);
    topAnswersList.appendChild(questionBlock);
  });
}

function showCelebration() {
  showScreen('celebration-screen');
  
  const totalScore = gameState.player1Score + gameState.player2Score;
  const isWin = totalScore >= 200;
  
  const icon = document.getElementById('celebration-icon');
  const title = document.getElementById('celebration-title');
  const message = document.getElementById('celebration-message');
  
  if (isWin) {
    icon.textContent = '🎉';
    title.textContent = 'YOU WIN!';
    message.textContent = `Amazing! You scored ${totalScore} points together! That's ${totalScore - 200} points over the target!`;
    launchConfetti();
  } else {
    icon.textContent = '😅';
    title.textContent = 'SO CLOSE!';
    message.textContent = `You scored ${totalScore} points together. Just ${200 - totalScore} points away from victory! Try again?`;
  }
}

function launchConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      container.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }, i * 30);
  }
}

function resetGame() {
  document.getElementById('confetti-container').innerHTML = '';
  document.getElementById('p1-results-items').innerHTML = '';
  document.getElementById('p2-results-items').innerHTML = '';
  document.getElementById('p1-total-container').style.display = 'none';
  document.getElementById('p2-total-container').style.display = 'none';
  document.getElementById('p1-continue-btn').style.display = 'none';
  document.getElementById('p2-continue-btn').style.display = 'none';
  document.getElementById('p1-next-container').style.display = 'none';
  document.getElementById('p2-next-container').style.display = 'none';
  // Return to setup screen to allow new custom questions
  showScreen('setup-screen');
}

// ===== SETUP SCREEN FUNCTIONS =====

function updatePrompt() {
  const themeInput = document.getElementById('themeInput');
  const promptElement = document.getElementById('promptDisplay');
  const theme = themeInput.value.trim();
  
  if (!theme) {
    // Default prompt with no theme
    promptElement.textContent = `Generate 5 creative Family Feud Fast Money questions in JSON format. Each question should have 6 answers ranked by popularity. The point values for each question must add up to exactly 100. Use varied point values (not just multiples of 5). Make the questions fun and non-obvious. Format as JSON with this structure:
{
  "questions": [
    {
      "id": 1,
      "question": "Your question here?",
      "answers": [
        {"text": "Answer 1", "points": 30},
        {"text": "Answer 2", "points": 25},
        {"text": "Answer 3", "points": 20},
        {"text": "Answer 4", "points": 13},
        {"text": "Answer 5", "points": 8},
        {"text": "Answer 6", "points": 4}
      ]
    }
  ]
}`;
  } else {
    // Prompt with theme (theme in CAPS)
    const themeUpper = theme.toUpperCase();
    promptElement.textContent = `Generate 5 creative Family Feud Fast Money questions about ${themeUpper} in JSON format. Each question should relate to the ${themeUpper} theme. Each question should have 6 answers ranked by popularity. The point values for each question must add up to exactly 100. Use varied point values (not just multiples of 5). Make the questions fun and non-obvious. Format as JSON with this structure:
{
  "questions": [
    {
      "id": 1,
      "question": "Your question here related to ${themeUpper}?",
      "answers": [
        {"text": "Answer 1", "points": 30},
        {"text": "Answer 2", "points": 25},
        {"text": "Answer 3", "points": 20},
        {"text": "Answer 4", "points": 13},
        {"text": "Answer 5", "points": 8},
        {"text": "Answer 6", "points": 4}
      ]
    }
  ]
}`;
  }
}

async function copyPrompt() {
  const promptText = document.getElementById('promptDisplay').textContent;
  const copyBtn = document.getElementById('copyPromptBtn');
  const originalText = copyBtn.textContent;
  const originalBg = copyBtn.style.backgroundColor;
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(promptText);
      copyBtn.textContent = '✓ Copied!';
      copyBtn.style.backgroundColor = '#4CAF50';
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = promptText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copyBtn.textContent = '✓ Copied!';
      copyBtn.style.backgroundColor = '#4CAF50';
    }
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.backgroundColor = originalBg;
    }, 2000);
  } catch (err) {
    copyBtn.textContent = 'Failed to copy';
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.backgroundColor = originalBg;
    }, 2000);
  }
}

function clearJSON() {
  document.getElementById('custom-json-input').value = '';
  hideError();
}

function showError(message) {
  const errorEl = document.getElementById('error-message');
  errorEl.textContent = '❌ ' + message;
  errorEl.classList.add('show');
}

function hideError() {
  const errorEl = document.getElementById('error-message');
  errorEl.classList.remove('show');
}

function validateJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    // Check if questions array exists
    if (!data.questions || !Array.isArray(data.questions)) {
      return { valid: false, error: 'JSON must contain a "questions" array' };
    }
    
    // Check if there are questions
    if (data.questions.length === 0) {
      return { valid: false, error: 'Questions array cannot be empty' };
    }
    
    // Validate each question
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];
      
      if (!q.question || typeof q.question !== 'string') {
        return { valid: false, error: `Question ${i + 1} is missing a "question" field` };
      }
      
      if (!q.answers || !Array.isArray(q.answers)) {
        return { valid: false, error: `Question ${i + 1} must have an "answers" array` };
      }
      
      if (q.answers.length === 0) {
        return { valid: false, error: `Question ${i + 1} has no answers` };
      }
      
      // Validate each answer
      for (let j = 0; j < q.answers.length; j++) {
        const a = q.answers[j];
        
        if (!a.text || typeof a.text !== 'string') {
          return { valid: false, error: `Question ${i + 1}, Answer ${j + 1} is missing "text" field` };
        }
        
        if (a.points === undefined || typeof a.points !== 'number') {
          return { valid: false, error: `Question ${i + 1}, Answer ${j + 1} is missing "points" field or points is not a number` };
        }
      }
      
      // Ensure id exists (or create it)
      if (!q.id) {
        q.id = i + 1;
      }
    }
    
    return { valid: true, data: data };
    
  } catch (e) {
    return { valid: false, error: 'Invalid JSON format: ' + e.message };
  }
}

function validateAndStartCustom() {
  const jsonInput = document.getElementById('custom-json-input').value.trim();
  
  if (!jsonInput) {
    showError('Please paste JSON in the textarea first');
    return;
  }
  
  const validation = validateJSON(jsonInput);
  
  if (!validation.valid) {
    showError(validation.error);
    return;
  }
  
  // Valid JSON - set as active game data
  gameData = validation.data;
  hideError();
  
  // Show welcome screen
  showScreen('welcome-screen');
}

function startWithDefault() {
  // Reset to default questions
  gameData = defaultGameData;
  hideError();
  
  // Show welcome screen
  showScreen('welcome-screen');
}

// Initialize prompt on page load
window.addEventListener('DOMContentLoaded', () => {
  updatePrompt();
});