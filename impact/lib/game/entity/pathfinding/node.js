ig.module( 
    'game.entity.pathfinding.node' 
)
.requires(
    'impact.entity',
    'plugins.underscore'
)
.defines(function(){

EntityNode = ig.Entity.extend({
	sizeMultiple: 16,
    size: {x: 0, y: 0},
    offset: {x: 0, y: 0},
    animSheet: new ig.AnimationSheet( 'media/node.png', 16, 16),
    friction: {x: 0, y: 0},
    type: ig.Entity.TYPE.NONE,
    gravityFactor: 0,

    init: function( x, y, settings ) {
        this.addAnim( 'idle', 0.1, [0] );
        this.parent( x, y, settings );
    },

    update: function() {
		this.parent();
    },
    
    draw: function() {
		var ctx = ig.system.context;
		ctx.save();
		ctx.translate( ig.system.getDrawPos( this.pos.x - this.offset.x - ig.game.screen.x ),
			ig.system.getDrawPos( this.pos.y - this.offset.y - ig.game.screen.y ) );
		ctx.scale( this.width, this.height );
		this.currentAnim.draw( 0, 0 );
		ctx.restore();
    },
    
    setCoords: function(coords) {
        var minX = coords[0].x
        var minY = coords[0].y
        var maxX = coords[0].x
        var maxY = coords[0].y
        
        coords.forEach(function(position) {
            maxX = (position.x > maxX) ? position.x : maxX;
            maxY = (position.y > maxY) ? position.y : maxY;
            minX = (position.x < minX) ? position.x : minX;
            minY = (position.y < minY) ? position.y : minY;
        })
        
        this.width  = maxX - minX + 1
        this.height = maxY - minY + 1
        
        this.size.x = this.width * this.sizeMultiple
        this.size.y = this.height * this.sizeMultiple
        
        this.offset.x = this.size.x / 2
        this.offset.y = this.size.y / 2
        
        this.pos.x = (maxX-.5) * this.sizeMultiple
        this.pos.y = (maxY+.5) * this.sizeMultiple
    }
});

});