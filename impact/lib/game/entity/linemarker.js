ig.module( 
    'game.entity.linemarker' 
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityLineMarker = ig.Entity.extend({
    size: {x: 5, y: 5},
    offset: {x: 0, y: 0},
    animSheet: new ig.AnimationSheet( 'media/linemarker.png', 5, 5),
    speed: 0,
    maxVel: {x: 0, y: 0},
    friction: {x: 0, y: 0},
    type: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,
	zIndex: 50,
    utils: undefined,

    init: function( x, y, settings ) {
        this.addAnim( 'idle', 0.1, [0] );
        this.parent( x, y, settings );
		
		this.pos.x = (settings.coords.x * 16) + 4;
		this.pos.y = (settings.coords.y * 16) + 4;
        
        this.utils = new ig.Utils();
    },

    getCoordinates: function() {
      return this.utils.getCoordinates(this.pos);  
    },

    update: function() {
        this.parent();
    },
    
    draw: function() {
        return;
    }
});

});