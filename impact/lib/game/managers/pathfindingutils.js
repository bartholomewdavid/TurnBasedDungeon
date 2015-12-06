ig.module(
    'game.managers.pathfindingUtils' 
)
.requires(
    'impact.impact',
	'game.managers.utils',
	'game.entity.pathfinding.node',
	'plugins.underscore'
)
.defines(function(){

ig.PathfindingUtils = ig.Class.extend({
	utils: undefined,
	
    staticInstantiate: function() {
        if( ig.PathfindingUtils.instance == undefined ) {
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

	generateNodes: function(collisionData) {
		this.generateWalkNodes(collisionData)
	},
	
	generateWalkNodes: function(collisionData) {
		var checkedPositions = []
		
		for (var y = 0; y < collisionData.length; y++) {
			for (var x = 0; x < collisionData[y].length; x++) {
				// If walkable tile (has a floor)
				var output = this.generateWalkNode({x: x, y: y}, collisionData)
				checkedPositions.concat(output)
				//if (output.length > 3) return
			}
		}
	},
	
	generateWalkNode: function(position, collisionData) {
		var checkedNodes = [position]
		var positionsForNode = []
		var utils = this.utils
		
		// Find all connected walkable positions
		if (utils.isWalkable(position, collisionData)) {
			// Proceed only is initial position is walkable
			// Add initial position to the list
			positionsForNode.push(position)
			
			var newPosition = _.clone(position)
			while (true) {
				// Check all positions to the left
				newPosition.x--
				if (newPosition.x < 0 || newPosition.x >= collisionData.length-1) break;
				// Add all nodes to checked list
				checkedNodes.push(newPosition)
				if (utils.isWalkable(newPosition, collisionData)) {
					positionsForNode.push(_.clone(newPosition))
				} else {
					break;
				}
			}
			// Check all positions to the right
			newPosition = _.clone(position)
			while (true) {
				// Check all positions to the left
				newPosition.x++
				if (newPosition.x < 0 || newPosition.x >= collisionData.length-1) break;
				// Add all nodes to checked list
				checkedNodes.push(newPosition)
				if (utils.isWalkable(newPosition, collisionData)) {
					positionsForNode.push(_.clone(newPosition))
				} else {
					break;
				}
			}
		}
		// If more then 1 position is found, make a walk node
		if (positionsForNode.length > 1) {
			ig.game.spawnEntity(EntityNode).setCoords(positionsForNode)
		}

		// Return list of checked positions
		return checkedNodes
		
	}
})

})