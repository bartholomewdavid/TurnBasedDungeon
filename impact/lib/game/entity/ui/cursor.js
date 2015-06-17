ig.module( 
    'game.entity.ui.cursor' 
)
.requires(
    'game.entity.dungeonEntity',
    'game.entity.ui.cursorAction'
)
.defines(function(){

EntityCursor = ig.DungeonEntity.extend({
    size: {x: 16, y: 16},
    offset: {x: 0, y: 0},
    animSheet: new ig.AnimationSheet( 'media/cursor.png', 16, 16),
    speed: 0,
    maxVel: {x: 0, y: 0},
    friction: {x: 0, y: 0},
    type: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.NEVER,
    checkAgainst: ig.Entity.TYPE.NONE,
    zIndex: 100,
    isSet: false,
    currentEntity: undefined,
    currentActions: [],
    currentActionEntities: [],
    game: undefined,

    init: function( x, y, settings ) {
        this.addAnim( 'idle', 0.2, [0,1,0] );
        this.parent( x, y, settings );
    },

    update: function() {
        this.parent();
    },
    
    draw: function() {
        if (this.isSet == false)
            return;
          
        this.parent();
    },
    
    clickPosition: function( val ) {
        if (this.isSet == false) {
            this.isSet = true;
        }
        
        this.clearActions(this);
        this.setPosition(val);
    },
    
    isActive: function() {
        if (this.currentActions.length || this.currentActionEntites)
            return true;
        return false;  
    },
    
    clearActions: function(self) {
        while (self.currentActions.length) {
            self.currentActions.pop();
        } 
        while (self.currentActionEntities.length) {
            self.currentActionEntities.pop().kill();
        }
    },
    
    displayActions: function() {
        var x = (this.pos.x - (this.currentActions.length * 24) / 2);
        var y = this.pos.y - 24;
        var self = this;
        this.currentActions.map( function(str) {
            var CAE = self.game.spawnEntity( EntityCursorAction, x, y, {game: self.game} );
            var command = undefined;
            self.currentActionEntities.push(CAE);
            CAE.currentAnim = CAE.anims[str];
            
            if (str == "Cancel") {
                command = function() {
                    self.clearActions(self);
                    self.isSet = false;
                };
            } else if (str == "Horizontal") {
                command = function() {
                    var cPos = self.getCoordinates();
                    var pPos = self.currentEntity.getCoordinates();
                    var amt = Math.abs(cPos.x - pPos.x);
                    if (cPos.x > pPos.x) {
                        self.currentEntity.moveRight(amt);
                    } else if (cPos.x < pPos.x) {
                        self.game.player.moveLeft(amt);
                    }
                    self.clearActions(self);
                    self.isSet = false;
                };
            } else if (str == "Diagonal") {
                command = function() {
                    var cPos = self.getCoordinates();
                    var pPos = self.currentEntity.getCoordinates();
                    var amt = Math.abs(cPos.x - pPos.x);
                    if (cPos.x > pPos.x) {
                        if (cPos.y < pPos.y)
                            self.currentEntity.climbUpRight(amt);
                        else
                            self.currentEntity.climbDownRight(amt);
                    } else if (cPos.x < pPos.x) {
                        if (cPos.y < pPos.y)
                            self.currentEntity.climbUpLeft(amt);
                        else
                            self.currentEntity.climbDownLeft(amt);
                    }
                    self.clearActions(self);
                    self.isSet = false;
                };
            } else if (str == "Jump") {
                command = function() {
                    var cPos = self.getCoordinates();
                    var pPos = self.currentEntity.getCoordinates();
                    if (cPos.x > pPos.x) {
					   self.currentEntity.createJumpIndicator(self.currentEntity, true);
                    } else if (cPos.x < pPos.x) { 
	   				   self.currentEntity.createJumpIndicator(self.currentEntity, false);
                    }
                    
                    var confirmCommand = function() {
                        self.currentEntity.jump();
                        self.clearActions(self);
                        self.isSet = false;
                    }
                    
                    self.displayConfirmation(self, confirmCommand);
                };
            } else if (str == "Vertical") {
                command = function() {
                    self.clearActions(self);
                    self.isSet = false;   
                };         
            } else if (str == "Interact") {
                command = function() {
                    self.clearActions(self);
                    self.isSet = false;   
                };         
            } else if (str == "Examine") {
                command = function() {
                    self.clearActions(self);
                    self.isSet = false;   
                };         
            }
            
            CAE.command = command;
            
            x+= 24; 
        });
    },
    
    displayConfirmation(self, confirmCommand) {
        self.clearActions(self);
        self.currentActions.push("Confirm");
        self.currentActions.push("Cancel");

        var x = (self.pos.x - (self.currentActions.length * 24) / 2);
        var y = self.pos.y - 24;
        self.currentActions.map( function(str) {
            var CAE = self.game.spawnEntity( EntityCursorAction, x, y, {game: self.game} );
            var command = undefined;
            self.currentActionEntities.push(CAE);
            CAE.currentAnim = CAE.anims[str];
            
            if (str == "Confirm") {
                command = confirmCommand;
            } else if (str == "Cancel") {
                command = function() {
                    self.clearActions(self);
                    self.isSet = false;
                };
            }
            
            CAE.command = command;
            x += 24;
        });
    },
    
    setEntity: function( e ) {
      this.currentEntity = e;  
    },
    
    setPosition: function( val ) {
        if (val == undefined)
            return;
            
        var x = Math.floor((ig.game.screen.x + val.x) / 16) * 16;
        var y = Math.floor((ig.game.screen.y + val.y) / 16) * 16;
        
        this.pos.x = x;
        this.pos.y = y;
    }
});

});