
const WIDTH = 400;
const HEIGHT = 400;
const FPS = 30;
const PLAYER_SPEED = 300;
const BALL_SPEED = 400;
const PAUSE_TEXT = 'Pausa';
const PAUSE_STYLE = { font: '20px Arial', fill: '#fff' };

// Variables globales
var player, background, ball, pauseLabel, menu;
var cursors, nnNetwork, nnTrainer, nnOutput, trainingData = [];
var isAutoMode = false, isTrainingComplete = false;
var JX = 250, JY = 250;

// Inicialización del juego Phaser
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

// Precarga de assets del juego
function preload() {
    game.load.image('background', 'assets/game/fondo1.png');
    game.load.spritesheet('player', 'assets/sprites/altair.png', 32, 48);
    game.load.image('menu', 'assets/game/menu.png');
    game.load.image('ball', 'assets/sprites/purple_ball.png');
}

// Inicialización de elementos del juego
function create() {
    // Inicialización de sistema de física
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 0; // No hay gravedad para el movimiento libre
    game.time.desiredFps = FPS;

    // Creación del fondo y jugador
    background = game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'background');
    player = game.add.sprite(WIDTH / 2, HEIGHT / 2, 'player');
    game.physics.enable(player);
    player.body.collideWorldBounds = true;
    var run = player.animations.add('run', [8, 9, 10, 11]);
    player.animations.play('run', 10, true);

    // Creación de la bola
    ball = game.add.sprite(0, 0, 'ball');
    game.physics.enable(ball);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    setRandomBallVelocity();

    // Creación de etiqueta para pausa
    pauseLabel = game.add.text(WIDTH - 100, 20, PAUSE_TEXT, PAUSE_STYLE);
    pauseLabel.inputEnabled = true;
    pauseLabel.events.onInputUp.add(pauseGame, this);
    game.input.onDown.add(handlePauseClick, this);

    // Captura de teclas de flecha
    cursors = game.input.keyboard.createCursorKeys();

    // Inicialización de red neuronal y entrenador
    // La red tiene 3 neuronas de entrada, tres capas ocultas con 6 neuronas cada una y 5 neuronas de salida
    nnNetwork = new synaptic.Architect.Perceptron(3, 6, 6, 6, 5);
    nnTrainer = new synaptic.Trainer(nnNetwork);
}

// Establece una velocidad aleatoria para la bola
function setRandomBallVelocity() {
    var angle = game.rnd.angle();
    ball.body.velocity.set(Math.cos(angle) * BALL_SPEED, Math.sin(angle) * BALL_SPEED);
}

// Pausa el juego y muestra el menú de pausa
function pauseGame() {
    game.paused = true;
    menu = game.add.sprite(WIDTH / 2, HEIGHT / 2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}

// Maneja los clics en el menú de pausa
function handlePauseClick(event) {
    // Cálculo de límites del menú de pausa
    if (game.paused) {
        var menuBounds = {
            x1: WIDTH / 2 - 270 / 2,
            x2: WIDTH / 2 + 270 / 2,
            y1: HEIGHT / 2 - 180 / 2,
            y2: HEIGHT / 2 + 180 / 2
        };

        // Acciones basadas en la posición del clic
        if (event.x > menuBounds.x1 && event.x < menuBounds.x2 && event.y > menuBounds.y1 && event.y < menuBounds.y2) {
            if (event.y <= menuBounds.y1 + 90) {
                resetTraining();
            } else if (event.y > menuBounds.y1 + 90) {
                if (!isTrainingComplete && trainingData.length > 0) {
                    console.log("Entrenamiento con " + trainingData.length + " valores.");
                    nnTrainer.train(trainingData, { rate: 0.0003, iterations: 10000, shuffle: true });
                    isTrainingComplete = true;
                }
                isAutoMode = true;
            }
            menu.destroy();
            resetGame();
            game.paused = false;
        }
    }
}

// Reinicia los datos de entrenamiento
function resetTraining() {
    isTrainingComplete = false;
    trainingData = [];
    isAutoMode = false;
}

// Reinicia el estado del juego
function resetGame() {
    player.x = WIDTH / 2;
    player.y = HEIGHT / 2;
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    ball.x = 0;
    ball.y = 0;
    setRandomBallVelocity();
}

// Actualiza la lógica del juego en cada cuadro
function update() {
    background.tilePosition.x -= 1; // Mueve el fondo para crear efecto de desplazamiento

    if (!isAutoMode) {
        handlePlayerInput();
    }

    game.physics.arcade.collide(ball, player, handleCollision, null, this);

    var dx = ball.x - player.x;
    var dy = ball.y - player.y;
    var distance = Math.sqrt(dx * dx + dy * dy); // Distancia euclidiana entre la bola y el jugador

    if (!isAutoMode) {
        storeTrainingData(dx, dy, distance);
    } else if (isAutoMode) {
        autoMovePlayer(dx, dy, distance);
    }
}

// Maneja la entrada del jugador desde el teclado
function handlePlayerInput() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -PLAYER_SPEED;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = PLAYER_SPEED;
    }

    if (cursors.up.isDown) {
        player.body.velocity.y = -PLAYER_SPEED;
    } else if (cursors.down.isDown) {
        player.body.velocity.y = PLAYER_SPEED;
    }
}

// Almacena los datos de entrenamiento para la red neuronal
function storeTrainingData(dx, dy, distance) {
    var left = cursors.left.isDown ? 1 : 0;
    var right = cursors.right.isDown ? 1 : 0;
    var up = cursors.up.isDown ? 1 : 0;
    var down = cursors.down.isDown ? 1 : 0;

    JX = player.x;
    JY = player.y;

    trainingData.push({
        input: [dx, dy, distance, JX, JY],
        output: [left, right, up, down, 1] // 1 indica que hay movimiento
    });

    console.log(
        "Diferencia de la posicion de la bola contra la del jugador en X: ", dx + "\n" +
        "Diferencia de la posicion de la bola contra la del jugador en Y: ", dy + "\n" +
        "Distancia euclidiana entre la bola y el jugador: ", distance + "\n" +
        "Posicion del jugador en X: ", JX + "\n" +
        "Posicion del jugador en Y: ", JY + "\n"
    );
    console.log(
        "Izquierda: ", left + "\n" +
        "Derecha: ", right + "\n" +
        "Arriba: ", up + "\n" +
        "Abajo: ", down + "\n"
    );
}

function autoMovePlayer(dx, dy, distance) {
    var input = [dx, dy, distance, JX, JY];
    nnOutput = nnNetwork.activate(input);

    var left = nnOutput[0];
    var right = nnOutput[1];
    var up = nnOutput[2];
    var down = nnOutput[3];
    var moving = nnOutput[4];

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (left >= 0.5) {
        player.body.velocity.x = -PLAYER_SPEED;
    } else if (right >= 0.5) {
        player.body.velocity.x = PLAYER_SPEED;
    }

    if (up >= 0.5) {
        player.body.velocity.y = -PLAYER_SPEED;
    } else if (down >= 0.5) {
        player.body.velocity.y = PLAYER_SPEED;
    }

    if (moving < 0.5) {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
    }
}

// Maneja la colisión entre la bola y el jugador
function handleCollision() {
    isAutoMode = false;
}

// Renderiza el estado del juego
function render() {
    // Opcionalmente, renderizar el estado del juego o información adicional
}
