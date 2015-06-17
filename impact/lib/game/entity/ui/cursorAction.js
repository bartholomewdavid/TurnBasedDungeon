ig.module( 
    'game.entity.ui.cursorAction' 
)
.requires(
    'game.entity.dungeonEntity'
)
.defines(function(){

EntityCursorAction = ig.DungeonEntity.extend({
    size: {x: 16, y: 16},
    offset: {x: 0, y: 0},
    animSheet: new ig.AnimationSheet( 'media/cursorActions.png', 16, 16),
    speed: 0,
    maxVel: {x: 0, y: 0},
    friction: {x: 0, y: 0},
    type: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,
    zIndex: 100,
    command: undefined,

    ANIMS: [
        'Vertical',
        'Horizontal',
        'Jump',
        'Diagonal',
        'Confirm',
        'Interact',
        'Cancel',
        'Examine'
    ],

    init: function( x, y, settings ) {
        this.addAnim( this.ANIMS[0], 0.1, [0] );
        this.addAnim( this.ANIMS[1], 0.1, [1] );
        this.addAnim( this.ANIMS[2], 0.1, [2] );
        this.addAnim( this.ANIMS[3], 0.1, [3] );
        this.addAnim( this.ANIMS[4], 0.1, [4] );
        this.addAnim( this.ANIMS[5], 0.1, [5] );
        this.addAnim( this.ANIMS[6], 0.1, [6] );
        this.addAnim( this.ANIMS[7], 0.1, [7] );
        this.parent( x, y, settings );
    },

    update: function() {
        this.parent();
    },
    
    draw: function() {
        this.parent();
    },
    
    execute: function() {
      if (this.command != undefined) {
        this.command();
      }
    }
});

});