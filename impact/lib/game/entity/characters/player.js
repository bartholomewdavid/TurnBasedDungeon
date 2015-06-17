ig.module( 
    'game.entity.characters.player' 
)
.requires(
    'game.entity.dungeonEntity'
)
.defines(function(){

EntityPlayer = ig.DungeonEntity.extend({
    size: {x: 16, y: 16},
    offset: {x: 0, y: 0},
    animSheet: new ig.AnimationSheet( 'media/person.png', 16, 16),
    friction: {x: 0, y: 0},
    type: ig.Entity.TYPE.A,

    init: function( x, y, settings ) {
        this.addAnim( 'idle', 0.1, [0] );
        this.parent( x, y, settings );
    },

    update: function() {
		this.parent();
    },
});

});