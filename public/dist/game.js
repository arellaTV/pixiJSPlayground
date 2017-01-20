PIXI.settings.SCALE_MODE = 1;
var gameView = document.getElementById('gameView');
var renderer = new PIXI.WebGLRenderer(144,256, {resolution: 3});
var stage = new PIXI.Container();
gameView.appendChild(renderer.view);


PIXI.loader
.add('images/spritesheet.png')
.load(setup);

function setup() {
  var texture = PIXI.Texture.fromImage('images/spritesheet.png');
  var rectangle = new PIXI.Rectangle(0, 0, 144, 256);
  texture.frame = rectangle;
  var background = new PIXI.Sprite(texture);

  stage.addChild(background);
  renderer.render(stage);
}
