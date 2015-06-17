ig.module( 
    'game.managers.inputmanager' 
)
.requires(
    'impact.impact',
	'game.managers.utils',
	'plugins.underscore'
)
.defines(function(){

InputManager = ig.Class.extend({
	game: undefined,
	collisionData: undefined,
	utils: undefined,
	cursor: undefined,
	commands: [],
	
	setGame: function( val ) {
		this.game = val;
		this.collisionData = this.game.collisionMap.data;
		this.utils = new ig.Utils();
		this.cursor = this.game.cursor;
	},

	initInput: function() {
		ig.input.initMouse();
		ig.input.bind( ig.KEY.MOUSE1, 'CLICK' );
	},

	//Must be called manually
    update: function() {
		//When players turn and shit
		if (true) {
			var sur = undefined;
			var PC = this.game.player.getCoordinates();
			var game = this.game;
			var cursor = this.cursor;
			var collisionData = this.collisionData;
			var utils = this.utils;

			//Add logic for game animations and shit
			var gameState = game.getGameState();
			var cursorActive = cursor.isActive();
				
			if (gameState == game.GAME_STATES.PLAYER_TURN_ANIMATING) {
				return;
			}				
				
			if (gameState == game.GAME_STATES.PLAYER_TURN_INPUT) {
				if (ig.input.pressed( 'CLICK' )) {
					if (cursorActive == true) {
						var mx = ig.input.mouse.x + game.screen.x;
						var my = ig.input.mouse.y + game.screen.y;
						
						for (var i = 0; i < cursor.currentActionEntities.length; i++) {
							var pos = cursor.currentActionEntities[i].pos;
							var size = cursor.currentActionEntities[i].size;
							var cae = cursor.currentActionEntities[i];

							if (mx >= pos.x &&
								mx <= pos.x + size.x &&
								my >= pos.y &&
								my <= pos.y + size.y) {
									cae.execute();
							} 
						}
						
						return;
					}
				}
			}

			if (ig.input.pressed( 'CLICK' )) {
				if (cursorActive == false) {
					var cursor = this.game.cursor;
					cursor.setEntity(this.game.player);
					cursor.clickPosition(ig.input.mouse);
			        //Cursor Position
			        var CP = this.utils.getCoordinates(cursor.pos);
			        //Entity Position
			        var EP = this.utils.getCoordinates(cursor.currentEntity.pos);
					
					// Ranges are created the way they are because outer range is exclusive
			        if (CP.x == EP.x) {
			            //Vertical
						var inc = (EP.y > CP.y) ? 1 : -1;
						var range = _.range(CP.y, EP.y, inc);
						var valid = false;
						if (valid) {
			            	cursor.currentActions.push("Vertical");
						}
			        } else if (CP.y == EP.y) {
			            //Horizontal
						var inc = (EP.x > CP.x) ? 1 : -1;
						var range = _.range(CP.x, EP.x, inc);
						var valid = true;
						_.each(range, function(val) {
							if (utils.isWalkable({x: val, y: CP.y}, collisionData) == false) {
								valid = false;
								return;
							}
						})
						if (valid) {
							cursor.currentActions.push("Horizontal");
						}
			        } else if (Math.abs(CP.y - EP.y) == Math.abs(CP.x - EP.x)) {
			            //Diagonal
						var incX = (EP.x > CP.x) ? 1 : -1;
						var incY = (EP.y > CP.y) ? 1 : -1;
						var rangeX = _.range(CP.x, EP.x, incX);
						var rangeY = _.range(CP.y, EP.y, incY);
						var valid = true;
						for (var i = 0; i < rangeX.length; i++) {
							if (utils.isWalkable({x: rangeX[i], y: rangeY[i]}, collisionData) == false) {
								valid = false;
								return;
							}
						}
						if (valid) {
			            	cursor.currentActions.push("Diagonal");
						}
			        } else {
			            //Strange Movement
			        }
			        
			        cursor.currentActions.push("Jump");
			        cursor.currentActions.push("Interact");
			        cursor.currentActions.push("Examine");
			        cursor.currentActions.push("Cancel");
					
			        cursor.game.cursor.displayActions();
				}
			}
		}
    }
});

});