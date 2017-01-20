var gameView = document.getElementById('gameView');
var renderer = PIXI.autoDetectRenderer(432,768);
var stage = new PIXI.Container();
gameView.appendChild(renderer.view);

PIXI.loader
.add('images/spritesheet.png')
.load(setup);

function setup() {
  var texture = PIXI.utils.TextureCache['images/spritesheet.png'];
  var rectangle = new PIXI.Rectangle(0, 0, 144, 256);
  texture.frame = rectangle;

  var background = new PIXI.Sprite(texture);
  background.scale.x = 3;
  background.scale.y = 3;

  stage.addChild(background);
  renderer.render(stage);
}
