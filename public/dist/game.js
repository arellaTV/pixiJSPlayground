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

  var backgroundRectangle = new PIXI.Rectangle(0, 0, 144, 256);
  var backgroundTexture = new PIXI.Texture(texture, backgroundRectangle);
  var background = new PIXI.Sprite(backgroundTexture);

  var floorRectangle = new PIXI.Rectangle(292, 0, 168, 56);
  var floorTexture = new PIXI.Texture(texture, floorRectangle);
  var floor = new PIXI.Sprite(floorTexture);
  floor.position.y = 200;

  stage.addChild(background, floor);
  renderer.render(stage);
}
