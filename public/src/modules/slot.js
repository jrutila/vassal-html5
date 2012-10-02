(function(Slot) {

Slot.Slot = Backbone.Model.extend({
  defaults: {
    parameters: {},
  },
  initialize: function() {
    var Piece = vassal.module('piece');
    this.set('pieces', new Piece.PieceCollection());
  },
});

Slot.SlotView = Backbone.View.extend({
  _viewPointers: {},
  defaults: {
    allow_stacking: true,
  },
  initialize: function() {
    this.$el.data('backbone-view', this);
    this.model.get('pieces').on('add remove', this.renderPieces, this);
    this.$el.droppable({
      scope: 'piece',
      drop: this.drop,
    });
  },
  renderPieces: function(el, rel) {
    var vp = this._viewPointers;
    var offset = this.$el.offset();
    var $slot = this.$el;
    this.model.get('pieces').each(function(piece) {
      var $piece = vp[piece.cid].$el;
      $piece.appendTo($slot);
      offset.left += $slot.width()/2 - $piece.width()/2;
      offset.top += $slot.height()/2 - $piece.height()/2;
      $piece.offset(offset);
    });
  },
  drop: function(event, ui) {
    console.log('dropped to slot');
    var draggedView = $(ui.draggable).data("draggedView");
    var me = $(this).data('backbone-view');
    me._viewPointers[draggedView.model.cid] = draggedView
    draggedView.model.move(me.model);
  },
});

draggedView = undefined;

})(vassal.module('slot'));
