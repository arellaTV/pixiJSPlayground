PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
var gameView = document.getElementById('gameView');
var renderer = new PIXI.WebGLRenderer(144,256, {resolution: 3});
var stage = new PIXI.Container();

gameView.appendChild(renderer.view);

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  key.downHandler =function(event) {
    if (event.keyCode == key.code) {
      if (key.isUp && key.press) {
        key.press();
        key.isDown = true;
        key.isUp = false;
      }
    }
    event.preventDefault();
  }

  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) {
        key.release();
        key.isDown = false;
        key.isUp = true;
      }
    }
    event.preventDefault();
  }

  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  )
  return key;
}

var flap = keyboard(32);
var reset = keyboard(82);

reset.press = function() {
  console.log('reset!');
  stage.removeChildren();
  setup();
}

reset.release = function() {
  console.log('reset release');
}

PIXI.loader
.add('images/spritesheet.png')
.load(setup);

function setup() {
  console.log('in setup');
  var texture = new PIXI.BaseTexture.fromImage('images/spritesheet.png');

  var playerRectangle1 = new PIXI.Rectangle(3, 491, 17, 12);
  var playerRectangle2 = new PIXI.Rectangle(31, 491, 17, 12);
  var playerRectangle3 = new PIXI.Rectangle(59, 491, 17, 12);
  var playerTexture1 = new PIXI.Texture(texture, playerRectangle1);
  var playerTexture2 = new PIXI.Texture(texture, playerRectangle2);
  var playerTexture3 = new PIXI.Texture(texture, playerRectangle3);

  var frames = [];
  frames.push(playerTexture1);
  frames.push(playerTexture2);
  frames.push(playerTexture3);

  var player = new PIXI.extras.MovieClip(frames);
  player.animationSpeed = 0.15;
  player.anchor.x = 0.5;
  player.anchor.y = 0.5;
  player.position.x = 40;
  player.position.y = 60;
  player.play();
  player.rotation = 0;

  var backgroundRectangle = new PIXI.Rectangle(0, 0, 144, 256);
  var backgroundTexture = new PIXI.Texture(texture, backgroundRectangle);
  var background = new PIXI.Sprite(backgroundTexture);
  background.interactive = true;
  background.on('mousedown', onButtonDown);
  background.on('mouseup', onButtonUp);
  flap.press = onButtonDown.bind(this);
  flap.release = onButtonUp.bind(this);
  console.log(flap.press);

  var jump = false;

  function onButtonDown() {
    this.isdown = true;
    jump = true;
    setTimeout(() => {
      jump = false;
    }, 200)
  }

  function onButtonUp() {
    this.isdown = false;
    jump = false;
  }


  var groundTexture = new PIXI.Texture.fromImage('images/ground.png');
  var ground = new PIXI.extras.TilingSprite(groundTexture, 144, 56);
  ground.y = 200;

  var pipes = new PIXI.Container();

  setTimeout(() => {
    setInterval(() => {
      var randomY = Math.round(Math.random() * 100) + 80;

      for (var i = 0; i < pipes.children.length; i++) {
        if (pipes.children[i].position.x + pipes.children[i].width < 0) {
          pipes.children[i].destroy();
        }
      }

      var topPipeRectangle = new PIXI.Rectangle(56, 323, 26, 160);
      var topPipeTexture = new PIXI.Texture(texture, topPipeRectangle);
      var topPipe = new PIXI.Sprite(topPipeTexture);
      topPipe.position.y = -215;
      topPipe.position.y += randomY;
      topPipe.position.x = 144;

      var bottomPipeRectangle = new PIXI.Rectangle(84, 323, 26, 160);
      var bottomPipeTexture = new PIXI.Texture(texture, bottomPipeRectangle);
      var bottomPipe = new PIXI.Sprite(bottomPipeTexture);
      bottomPipe.position.y = randomY;
      bottomPipe.position.x = 144;
      pipes.addChild(bottomPipe, topPipe);
    }, 1175);
  }, 4000);

  var ticker = new PIXI.ticker.Ticker();
  ticker.start();
  var text = new PIXI.Text(`FPS: ${Math.round(ticker.FPS)}`,
  {fontSize: 4, dropShadow: true, dropShadowDistance: 1, dropShadowBlur: 1, fill: 'white', fontWeight: 'bold'});

  function collision(entity1, entity2) {
    var sprite1 = entity1.getBounds();
    var sprite2 = entity2.getBounds();
    var overlap = true;
    if (sprite1.left + 3 < sprite2.right && sprite1.right - 3 < sprite2.left ||
        sprite1.left + 3 > sprite2.right && sprite1.right - 3 > sprite2.left ||
        sprite1.top + 3 < sprite2.bottom && sprite1.bottom - 3 < sprite2.top ||
        sprite1.top + 3 > sprite2.bottom && sprite1.bottom - 3 > sprite2.top) {
      overlap = false;
    }

    return overlap;
  }

  function gameOver(animation) {
    ground.tilePosition.x = 0;
    x_velocity = 0;
    player.animationSpeed = 0;
    jump = false;
    flap.press = null;
    flap.release = null;
    if (player.position.y >= 195) {
      player.position.y = 195;
      cancelAnimationFrame(animation);
    }
  }

  var y_velocity = 0;
  var x_velocity = 1.2;
  function animate() {
    var animation = requestAnimationFrame(animate);
    ground.tilePosition.x -= x_velocity;
    for (var i = 0; i < pipes.children.length; i++) {
      pipes.children[i].position.x -= x_velocity;
      if (collision(player, pipes.children[i])) {
        gameOver(animation);
      }
    }

    y_velocity += 0.2;
    player.position.y += y_velocity;

    if (player.rotation < 1.5) {
      player.rotation += 0.05;
    } else {
      player.rotation = 1.5;
    }

    if (jump === true) {
      player.animationSpeed = 0.50;
      player.rotation = -0.5;
      y_velocity = -2;
    } else {
      player.animationSpeed = 0.15;
    }

    if (player.position.y >= 195) {
      player.position.y = 195;
    }

    if (player.position.y <= 0) {
      player.position.y = 0;
    }

    if (collision(player, ground)) {
      gameOver(animation);
    };

    ticker.update();
    renderer.render(stage);
  }

  setInterval(() => {
    text.text = `FPS: ${Math.round(ticker.FPS)}`;
  }, 1000)

  animate();
  stage.scale.x = 1;
  stage.scale.y = 1;
  stage.addChild(background, pipes, player, ground, text);
}
