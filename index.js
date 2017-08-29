const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const WIN_SCORE = 10;
const INITIAL_CHAOS_COUNT = 1;
var canvas;
var canvasContext;
var ballX = 400;
var ballY = 300;
var ballSpeedX = randomBallDirection();
var ballSpeedY = randomBallDirection();
var chaosCount = INITIAL_CHAOS_COUNT;

var paddle1Y = 250;
var paddle2Y = 250;

var player1Score = 0;
var player2Score = 0;

var showingWinScreen = false;

function calculateMousePosition(e) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = e.clientX - rect.left - root.scrollLeft;
  var mouseY = e.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY
  };
}

function handleMouseClick(e) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

function handleMouseMovement(e) {
  var mousePos = calculateMousePosition(e);
  paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', handleMouseMovement);

  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 32) {
      if (chaosCount > 0) {
        ballSpeedX = randomBallDirection(true);
        ballSpeedY = randomBallDirection(true);
        chaosCount--;
      }
    };
  });
};

function ballReset() {
  if (player1Score >= WIN_SCORE || player2Score >= WIN_SCORE) {
    showingWinScreen = true;
  }
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedX = randomBallDirection();
  ballSpeedY = randomBallDirection();
  chaosCount = INITIAL_CHAOS_COUNT;
}

function randomBallDirection(chaos) {
  const min = chaos ? 8 : 4;
  const max = chaos ? 14 : 7;
  var final = Math.round(Math.random()) ? getRandomInt(min, max) : -getRandomInt(min, max);
  return final;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if (paddle2YCenter < ballY - 20) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 20) {
    paddle2Y -= 6;
  }
};

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX >= canvas.width - 25) {
    if (ballY >= paddle2Y && ballY <= paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -(ballSpeedX * 1.1);

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.25;
    } else {
      player1Score++;
      ballReset();
    }
  }

  if (ballX <= 25) {
    if (ballY >= paddle1Y && ballY <= paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -(ballSpeedX * 1.1);

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.25;
    } else {
      player2Score++;
      ballReset();
    }
  }

  if (ballY >= canvas.height) {
    ballSpeedY  = -ballSpeedY;
  }

  if (ballY <= 0) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (var i = 10; i < canvas.height; i += 40) {
    colorRect(canvas.width/2 -1, i, 2, 20, 'white')
  }
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, 'green');

  if (showingWinScreen) {
    canvasContext.fillStyle = 'white';

    if (player1Score >= WIN_SCORE) {
      canvasContext.fillText("Player 1 Won!", 350, 200);
    } else if (player2Score >= WIN_SCORE) {
      canvasContext.fillText("Player 2 Won!", 350, 200);
    }

    canvasContext.fillText("Click to continue", 350, 500);
    return;
  }

  drawNet();

  // Player 1 Paddle
  colorRect(10, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
  // Player 2 Paddle
  colorRect(canvas.width - PADDLE_WIDTH - 10, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
  // Ball
  colorCircle(ballX, ballY, 10, 'white');

  canvasContext.fillText("Player 1", 100, 100);
  canvasContext.fillText(player1Score, 100, 120);
  canvasContext.fillText("Player 2", canvas.width - 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 120);
};

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
};

console.log('Sup, fool');
