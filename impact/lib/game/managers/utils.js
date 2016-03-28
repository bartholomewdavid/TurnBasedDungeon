ig.module(
  'game.managers.utils'
)
  .requires(
  'impact.impact'
  )
  .defines(function() {

    ig.Utils = ig.Class.extend({
      staticInstantiate: function() {
        if (ig.Utils.instance == undefined) {
          return null;
        }
        else {
          return ig.Utils.instance;
        }
      },

      init: function() {
        ig.Utils.instance = this;
      },

      surroundings: function(pos, collisionData) {
        //Max coords of collision
        var maxX = collisionData[0].length - 1;
        var maxY = collisionData.length - 1;

        var above = ((pos.y - 1) >= 0) ? collisionData[pos.y - 1][pos.x] : undefined;
        var aboveLeft = (((pos.y - 1) >= 0) && ((pos.x - 1) >= 0)) ? collisionData[pos.y - 1][pos.x - 1] : undefined;
        var aboveRight = (((pos.y - 1) >= 0) && ((pos.x + 1) <= maxX)) ? collisionData[pos.y - 1][pos.x + 1] : undefined;
        var left = ((pos.x - 1) >= 0) ? collisionData[pos.y][pos.x - 1] : undefined;
        var right = ((pos.x + 1) <= maxX) ? collisionData[pos.y][pos.x + 1] : undefined;
        var below = ((pos.y + 1) <= maxY) ? collisionData[pos.y + 1][pos.x] : undefined;
        var belowLeft = (((pos.y + 1) <= maxY) && ((pos.x - 1) >= 0)) ? collisionData[pos.y + 1][pos.x - 1] : undefined;
        var belowRight = (((pos.y + 1) <= maxY) && ((pos.x + 1) <= maxX)) ? collisionData[pos.y + 1][pos.x + 1] : undefined;
        var center = ((pos.x) >= 0) ? collisionData[pos.y][pos.x] : undefined;

        //ITS LIKE A NUMPAD! It even starts at 1
        return [undefined, belowLeft, below, belowRight, left, center, right, aboveLeft, above, aboveRight];
      },

      /**
       * Returns a boolean saying if the position within the collisionData
       * is clear in the center and is on a floor
       */
      isWalkable: function(pos, collisionData) {
        var sur = this.surroundings(pos, collisionData);
        if (sur[5] || !sur[2])
          return false;
        return true;
      },

      getCoordinates: function(pos) {
        var coords = { x: undefined, y: undefined };

        coords.x = Math.floor(pos.x / 16);
        coords.y = Math.floor(pos.y / 16);

        return coords;
      },
    });

  });