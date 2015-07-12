ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entity.characters.player',
	'game.entity.ui.cursor',
	'game.managers.cameramanager',
	'game.managers.inputmanager'
)
.defines(function(){

MyGame = ig.Game.extend({
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	tileSet: new ig.Image( 'media/tiles.png' ),
	player: undefined,
	cursor: undefined,
	gravity: 64,
	cameraManager: undefined,
	inputManager: undefined,
	utils: undefined,
	GAME_STATES: {
		PLAYER_TURN_INPUT: 0,
		PLAYER_TURN_ANIMATING: 1,
	},
	gameState: undefined,
	
	init: function() {		
		this.loadTestMap();
		this.loadCursor();
		this.loadPlayer();
		this.loadCameraManager();
		this.loadInputManager();
		this.utils = new ig.Utils();
		this.gameState = this.GAME_STATES.PLAYER_TURN_INPUT;
	},
	
	getGameState: function() {
		return this.gameState;
	},
	
	update: function() {
		this.inputManager.update();
		this.cameraManager.update();
		
		// Update all entities and backgroundMaps
		this.parent();
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	},
	
	loadPlayer: function() {
		this.player = this.spawnEntity( EntityPlayer, 128, 176, {game: this});	
	},
	
	loadCursor: function() {
		this.cursor = this.spawnEntity( EntityCursor, 128, 128, {game: this});
	},
	
	loadCameraManager: function() {
		this.cameraManager = new CameraManager();
		this.cameraManager.setGame(this);
		this.cameraManager.setTarget(this.player);
	},
	
	loadInputManager: function() {
		this.inputManager = new InputManager();
		this.inputManager.setGame(this);
		this.inputManager.initInput();
	},
	
	loadTestMap: function() {
		var collisionData = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,1,1,0,0,0,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		];
		
		var backgroundData = [
			[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
			[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
			[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
			[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
			[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
			[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
			[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
			[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
			[1,2,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
			[1,2,2,3,2,2,2,2,2,2,2,3,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
			[1,2,2,1,3,2,2,2,2,2,3,1,1,2,2,2,2,2,2,3,3,3,2,3,3,2,2,2,2,2,2,2,2,2,2,1],
			[1,2,2,2,1,3,2,2,2,3,1,1,1,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
			[1,3,3,3,1,1,3,3,3,1,1,1,1,3,3,3,3,3,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,1],
		];
		
		this.collisionMap = new ig.CollisionMap( 16, collisionData );
		this.backgroundMaps.push( new ig.BackgroundMap( 16, backgroundData, this.tileSet ));
	}
});


// Start the Game with 62fps, a resolution of 322x242, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 62, 322, 242, 2 );

});
