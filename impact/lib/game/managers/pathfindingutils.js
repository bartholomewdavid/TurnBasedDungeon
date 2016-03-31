ig.module(
  'game.managers.pathfindingUtils'
)
  .requires(
  'impact.impact',
  'game.managers.utils',
  'game.entity.pathfinding.nodegroup',
  'plugins.underscore'
  )
  .defines(function() {

    ig.PathfindingUtils = ig.Class.extend({
      utils: undefined,
      nodeGroups: [],

      staticInstantiate: function() {
        if (ig.PathfindingUtils.instance == undefined) {
          return null
        }
        else {
          return ig.PathfindingUtils.instance
        }
      },

      init: function() {
        ig.PathfindingUtils.instance = this
        this.utils = new ig.Utils()
      },

      generateNodeGroups: function(collisionData) {
        // Generate nodes completely if doing this over again
        this.nodeGroups.forEach(function(entity) {
          ig.game.removeEntity(entity)
        })

        this.generateWalkNodeGroups(collisionData)
        this.generateClimbNodeGroups(collisionData)
      },

      generateWalkNodeGroups: function(collisionData) {
        var checkedPositions = []

        for (var y = 0; y < collisionData.length; y++) {
          for (var x = 0; x < collisionData[y].length; x++) {
            // Only check tiles that havent been checked yet
            if (_.findWhere(checkedPositions, { x: x, y: y }) === undefined) {
              checkedPositions = checkedPositions.concat(this.generateWalkNodeGroup({ x: x, y: y }, collisionData))
            }
          }
        }
      },

      generateWalkNodeGroup: function(position, collisionData) {
        var checkedNodes = [position]
        var positionsForNode = []
        var utils = this.utils

        // Find all connected walkable positions
        if (utils.isWalkable(position, collisionData)) {
          // Proceed only is initial position is walkable
          // Add initial position to the list
          positionsForNode.push(_.clone(position))
          this.walkableIterator(_.clone(position), collisionData, -1, 0, checkedNodes, positionsForNode)
          this.walkableIterator(_.clone(position), collisionData, 1, 0, checkedNodes, positionsForNode)
        }
        // If more then 1 position is found, make a walk node
        if (positionsForNode.length > 1) {
          this.nodeGroups.push(ig.game.spawnEntity(EntityNodeGroup, 0, 0, { 'type': 'horizontal' }).setCoords(positionsForNode))
        }

        // Return list of checked positions
        return checkedNodes
      },

      generateClimbNodeGroups: function(collisionData) {
        var checkedPositions = []

        for (var y = 0; y < collisionData.length; y++) {
          for (var x = 0; x < collisionData[y].length; x++) {
            // Only check tiles that havent been checked yet
            if (_.findWhere(checkedPositions, { x: x, y: y }) === undefined) {
              checkedPositions = checkedPositions.concat(this.generateClimbNodeGroup({ x: x, y: y }, collisionData))
            }
          }
        }

        checkedPositions = []

        for (var y = 0; y < collisionData.length; y++) {
          for (var x = 0; x < collisionData[y].length; x++) {
            // Only check tiles that havent been checked yet
            if (_.findWhere(checkedPositions, { x: x, y: y }) === undefined) {
              checkedPositions = checkedPositions.concat(this.generateClimbNodeGroup({ x: x, y: y }, collisionData, true))
            }
          }
        }
      },

      generateClimbNodeGroup: function(position, collisionData, left) {
        var checkedNodes = [position]
        var positionsForNode = []
        var utils = this.utils
        var nodeType = (left) ? 'climb1' : 'climb2'
        left = left || false

        // Find all connected walkable positions
        if (utils.isWalkable(position, collisionData)) {
          // Proceed only is initial position is walkable
          // Add initial position to the list
          positionsForNode.push(_.clone(position))
          if (left) {
            this.walkableIterator(_.clone(position), collisionData, -1, -1, checkedNodes, positionsForNode)
            this.walkableIterator(_.clone(position), collisionData, 1, 1, checkedNodes, positionsForNode)
          } else {
            this.walkableIterator(_.clone(position), collisionData, -1, 1, checkedNodes, positionsForNode)
            this.walkableIterator(_.clone(position), collisionData, 1, -1, checkedNodes, positionsForNode)
          }
        }
        // If more then 1 position is found, make a walk node
        if (positionsForNode.length > 1) {
          this.nodeGroups.push(ig.game.spawnEntity(EntityNodeGroup, 0, 0, { 'type': nodeType }).setCoords(positionsForNode))
        }

        // Return list of checked positions
        return checkedNodes
      },

      walkableIterator: function(position, collisionData, xIter, yIter, checkedNodes, positionsForNode) {
        while (true) {
          // Check all positions to the left
          position.x += xIter
          position.y += yIter
          if (position.x < 0 || position.x >= collisionData.length - 1) break;
          // Add all nodes to checked list
          checkedNodes.push(_.clone(position))
          if (this.utils.isWalkable(position, collisionData)) {
            positionsForNode.push(_.clone(position))
          } else {
            break;
          }
        }
      },

      isWalkablePath: function(startPos, endPos, collisionData) {
        // Prereqs:
        //  - Refactor current nodes to be a larger node structure. Node group?
        //  - Refactor generateNode functions to return a list of nodes
        //  - Make a way to connect nodes together
        //  - Is there even a reason to have nodegroups besides visualization?

        // Make a list of visited nodes, + cost to get there (Empty list)
        // Being at the end position
        //
      },
    })

  })