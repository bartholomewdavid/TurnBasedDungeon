ig.module(
  'game.entity.pathfinding.nodegroup'
)
  .requires(
  'impact.entity',
  'plugins.underscore'
  )
  .defines(function() {

    EntityNodeGroup = ig.Entity.extend({
      sizeMultiple: 16,
      size: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      animSheet: new ig.AnimationSheet('media/nodegroup.png', 16, 16),
      friction: { x: 0, y: 0 },
      type: ig.Entity.TYPE.NONE,
      gravityFactor: 0,

      init: function(x, y, settings) {
        this.addAnim('horizontal', 0.1, [0])
        this.addAnim('climb1', 0.1, [1])
        this.addAnim('climb2', 0.1, [2])
        this.parent(x, y, settings)
        this.currentAnim = this.anims[settings.type]
      },

      update: function() {
        this.parent();
      },

      draw: function() {
        var ctx = ig.system.context;
        ctx.save();
        ctx.translate(ig.system.getDrawPos(this.pos.x - this.offset.x - ig.game.screen.x),
          ig.system.getDrawPos(this.pos.y - this.offset.y - ig.game.screen.y));
        ctx.scale(this.width, this.height);
        this.currentAnim.draw(0, 0);
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

        this.width = maxX - minX + 1
        this.height = maxY - minY + 1

        this.size.x = this.width * this.sizeMultiple
        this.size.y = this.height * this.sizeMultiple

        this.pos.x = (maxX * this.sizeMultiple) - ((this.width - 1) * this.sizeMultiple)
        this.pos.y = (maxY * this.sizeMultiple) - ((this.height - 1) * this.sizeMultiple)

        return this
      }
    });

  });