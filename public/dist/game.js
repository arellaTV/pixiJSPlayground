var renderer = PIXI.autoDetectRenderer(288,512);
var gameView = document.getElementById('gameView');

gameView.appendChild(renderer.view);

var stage = new PIXI.Container();
var container = new PIXI.Container();
