(function(Piece) {
  Piece.Piece = Backbone.Model.extend({
    defaults: {
      slot: undefined
    },
    move: function(slot) {
      console.log("moved");
      var currentSlot = this.get('slot');
      if (currentSlot != undefined)
      	currentSlot.get('pieces').remove(this);
      this.set('slot', slot);
      slot.get('pieces').add(this);
    },
  });

  Piece.PieceCollection = Backbone.Collection.extend({
    model: Piece
  });

  Piece.PieceView = Backbone.View.extend({
    tagName: 'div',
    className: 'piece',
    attributes: { 'draggable': 'true' },
    events: {
      "dragstart": 'dragStart',
      "dragend": 'dragEnd',
    },
    render: function() {
      this.$el.html(this.model.get('parameters')['name']);
      $('body').append(this.$el);
    },
    dragStart: function(e) {
      var ev = e.originalEvent;
      console.log('dstart');
      this.el.style.opacity = '0.7';
      ev.dataTransfer.effectAllowed = 'move';
      ev.dataTransfer.setData("application/x-moz-node", this.el);
      draggedView = this;
    },
    dragEnd: function(e) {
      var ev = e.originalEvent;
    },
  });
})(vassal.module('piece'));
