ig.module( 
    'game.entity.tilehighlight' 
)
.requires(
    'impact.entity'
)
.defines(function(){

EntityTileHighlight = ig.Entity.extend({
    size: {x: 16, y: 16},
    offset: {x: 0, y: 0},
    animSheet: new ig.AnimationSheet( 'media/tilehighlight.png', 16, 16),
    speed: 0,
    maxVel: {x: 0, y: 0},
    friction: {x: 0, y: 0},
    type: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,
	zIndex: 50,

    init: function( x, y, settings ) {
        this.addAnim( 'idle', 0.1, [0] );
        this.parent( x, y, settings );
		
		this.pos.x = (settings.coords.x * 16);
		this.pos.y = (settings.coords.y * 16);
    },

    update: function() {
        this.parent();
    },
    
    draw: function() {
        this.parent();
    }
});

});