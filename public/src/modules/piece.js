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
      'click': 'show_info',
    },
    initialize: function() {
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
      var dragImg = document.createElement('img');
      ev.dataTransfer.setDragImage(dragImg, 0, 0);
      this.orig_offset = this.$el.offset();
      draggedView = this;
    },
    dragEnd: function(e) {
      var ev = e.originalEvent;
      if (draggedView.enddrag != undefined)
        draggedView.enddrag(e);
      //this.$el.offset(this.orig_offset);
    },
    show_info: function(e) {
      if (this.get('info_view') == undefined)
      {
        this.set('info_view', new PieceInfo({
          model: this.model
        }));
        this.get('info_view').render();
      }
      //this.get('info_view').show();
    },
  });

  Piece.PieceInfo = Backbone.View.extend({
    tagName: 'div',
    className: 'piece_info',
    render: function() {
     // TODO: template 
     this.$el.prependTo('body');
     for (var h in this.model.get('parameters'))
     {
      this.$el.append('<div>'+h+'</div>');
     }
    },
  });
})(vassal.module('piece'));
