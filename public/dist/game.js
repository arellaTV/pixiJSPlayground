PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
var gameView = document.getElementById('gameView');
var renderer = new PIXI.WebGLRenderer(144,256, {resolution: 3});
var stage = new PIXI.Container();

gameView.appendChild(renderer.view);


PIXI.loader
.add('images/spritesheet.png')
.load(setup);

function setup() {
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
  player.anchor.set(0.5);
  player.position.x = 40;
  player.position.y = 60;
  player.play();

  var backgroundRectangle = new PIXI.Rectangle(0, 0, 144, 256);
  var backgroundTexture = new PIXI.Texture(texture, backgroundRectangle);
  var background = new PIXI.Sprite(backgroundTexture);
  background.interactive = true;
  background.on('mousedown', onButtonDown);
  background.on('mouseup', onButtonUp);

  var fall = true;

  function onButtonDown() {
    console.log('clicking!');
    this.isdown = true;
    fall = false;
  }

  function onButtonUp() {
    console.log('released!');
    this.isdown = false;
    fall = true;
  }


  var groundTexture = new PIXI.Texture.fromImage('images/ground.png');
  var ground = new PIXI.extras.TilingSprite(groundTexture, 144, 56);
  ground.y = 200;

  var pipes = new PIXI.Container();

  setTimeout(() => {
    setInterval(() => {
      var randomY = Math.round(Math.random() * 100) + 80;
      if (pipes.children.length > 6) {
        pipes.removeChildren(0, 2);
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

  function animate() {
    ground.tilePosition.x -= 1.2;
    for (var i = 0; i < pipes.children.length; i++) {
      pipes.children[i].position.x -= 1.2;
    }
    if (fall === true) {
      if (player.position.y < 194) {
        player.position.y += 1;
      } else {
        player.position.y = 194;
      }
    } else {
      player.position.y -= 1;
    }
    ticker.update();
    renderer.render(stage);
    requestAnimationFrame(animate);
  }

  setInterval(() => {
    text.text = `FPS: ${Math.round(ticker.FPS)}`;
  }, 1000)

  animate();
  stage.scale.x = 1;
  stage.scale.y = 1;
  stage.addChild(background, player, pipes, ground, text);
}
