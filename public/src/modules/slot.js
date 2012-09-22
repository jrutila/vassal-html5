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
    this.model.get('pieces').on('add remove', this.renderPieces, this);
  },
  events: {
  'dragover': 'dragOver',
  'drop': 'drop',
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
  dragOver: function(e) {
    if (draggedView == undefined)
      return true;
    console.log('over');
    var ev = e.originalEvent;
    if (! this.model.get('allow_stacking') && this.model.get('pieces').size() > 0)
      return true;
    if (ev.preventDefault) {
      ev.preventDefault();
    }
    draggedView.$el.offset(this.$el.offset());
    ev.dataTransfer.dropEffect = 'move';
    var thview = this;
    draggedView.enddrag = function(e) { thview.drop(e); };

    return false;
  },
  drop: function(e) {
    if (draggedView == undefined)
      return true;
    console.log('drop');
    var ev = e.originalEvent;
    if (ev.stopPropagation) {
      ev.stopPropagation();
    }
    var draggedModel = draggedView.model;
    this._viewPointers[draggedModel.cid] = draggedView;
    draggedModel.move(this.model);
    return false;
  },
});

draggedView = undefined;

})(vassal.module('slot'));
