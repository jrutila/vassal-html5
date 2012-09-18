(function(Piece) {
  Piece.Piece = Backbone.Model.extend({
  });

  Piece.PieceView = Backbone.View.extend({
    tagName: 'div',
    className: 'piece',
    attributes: { 'draggable': 'true' },
    events: {
      "dragstart": 'dragStart',
      "dragover": 'dragOver'
    },
    render: function() {
      this.$el.html('XXX');
      $('body').append(this.$el);
    },
    dragOver: function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
      //e.dataTransfer.dropEffect = 'move';

      return false;
    },
    dragStart: function(e) {
      console.log('dstart');
      this.el.style.opacity = '0.7';
      //e.dataTransfer.effectAllowed = 'move';
      //e.dataTransfer.setData('text/html', this.innerHTML);
    }
  });
})(vassal.module('piece'));
