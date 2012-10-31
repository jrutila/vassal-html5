(function(Slot) {

var Piece = vassal.module('piece');

Slot.SlotView = Backbone.View.extend({
  _viewPointers: {},
  defaults: {
    allow_stacking: true,
  },
  initialize: function() {
    this.$el.data('backbone-view', this);
    this.$el.droppable({
      scope: 'piece',
      drop: this.drop,
    });
  },
  renderPiece: function(piece) {
      this._renderPiece(piece);
  },
  drop: function(event, ui) {
    console.log('dropped to slot');
    var draggedView = $(ui.draggable).data("draggedView");
    var me = $(this).data('backbone-view');
    console.log(me.options['location']);
    draggedView.model.set('location', new Piece.PieceLocation(me.options['location']));
  },
});

draggedView = undefined;

})(vassal.module('slot'));
