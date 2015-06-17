ig.module( 
    'game.managers.cameramanager' 
)
.requires(
    'impact.impact'
)
.defines(function(){

CameraManager = ig.Class.extend({
	target: undefined,
	game: undefined,
	
	setGame: function( val ) {
		this.game = val;	
	},

	setTarget: function( val ) {
		this.target = val;
	},

	//Must be called manually
    update: function() {
		//Follow target
		if (this.target == undefined)
			return;
			
		var x = this.target.pos.x - (ig.system.width / 2);
		
		this.game.screen.x = x;
    }
});

});