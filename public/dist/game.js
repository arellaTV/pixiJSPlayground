var renderer = PIXI.autoDetectRenderer(432,768);
var gameView = document.getElementById('gameView');

gameView.appendChild(renderer.view);

var stage = new PIXI.Container();
var container = new PIXI.Container();

PIXI.loader
  .add('images/spritesheet.png')
  .load(setup);

var setup = function() {
  
}
