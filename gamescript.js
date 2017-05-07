var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 70;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var score = 0;
var lives = 3;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 70;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 45;

var bricks = [];
var c;
var r;
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1}
    }
}

/* Button detection (left arrow & right arrow) */
function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    } else if (e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    } else if (e.keyCode == 37) {
        leftPressed = false;
    }
}
/* Mouse detection */
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 + paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

/* Moving with arrows */
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

/* Moving with mouse */
document.addEventListener('mousemove', mouseMoveHandler);

/* Draw Bricks in myCanvas */
function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#0095dd';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

/* Draw ball in myCanvas */
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
}

/* Draw paddle in myCanvas */
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 1, paddleWidth, paddleHeight);
    ctx.fillStyle = '#083fa5';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

/* Function detects collision between Ball & frame, Ball & Paddle and contains GameOver statement */
function frameAndPaddleDetection() {
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y == canvas.height - ballRadius - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
    } else if (y == canvas.height - ballRadius) {
        lives--;
        if (!lives) {
            alert('GAME OVER!\nYour score is ' + score +'!');
            document.location.reload();
        } else {
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width - paddleHeight) / 2;
        }
    }
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    
    if (rightPressed && paddleX < canvas.width - paddleWidth - 1) {
        paddleX += 4;
    }
    if (leftPressed && paddleX > 1) {
        paddleX -= 4;
    }
    x += dx;
    y += dy;
    
    
}

/* Function detects collision between Ball & Bricks */
function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            // calculations
            if (b.status == 1) {
                if (x > b.x && y > b.y && y < b.y + brickHeight && x < b.x + brickWidth) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount*brickColumnCount) {
                        alert('YOU WIN, CONGRATULATIONS!\n Your score is ' + score +'!');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('Score: ' + score, 8, 20);
}

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

/* Draw every element in myCanvas & contains some logic */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    frameAndPaddleDetection();
    collisionDetection();
}

setInterval(draw, 10);
