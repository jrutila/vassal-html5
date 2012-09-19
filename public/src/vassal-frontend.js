var vassal = {
  module: function() {
    var modules = {};

    return function(name) {
      if (modules[name]) {
        return modules[name];
      }

      return modules[name] = { Views: {} };
    };
  }()
};

jQuery(function($) {
    $.get('bfm.xml', {}, function(xml) {
      console.log(xml);
      var Hex = vassal.module('hex');
      var grid = new Hex.HexGrid();
      $('hexgrid hex', xml).each(function() {
        var params = {};
        $("*", this).each(function() {
          params[$(this).attr('name')] = $(this).attr('value');
        });
        grid.add(new Hex.Hex({ parameters: params, x: parseInt($(this).attr('x')), y: parseInt($(this).attr('y')) }));
      });
      var hex_view = new Hex.HexGridView({
        el: $('#hexCanvas'),
        grid: grid
      });
      hex_view.render();
    });

    var Piece = vassal.module('piece');
    var p = new Piece.Piece({
      parameters: { name: 'SU 1 Shock' }
    });
    var pv = new Piece.PieceView({
      model: p
    });
    pv.render();
    p = new Piece.Piece({
      parameters: { name: 'SU 2 Shock' }
    });
    pv = new Piece.PieceView({
      model: p
    });
    pv.render();
});


var Slot = Backbone.Model.extend({
  defaults: {
    parameters: {},
  },
  initialize: function() {
    var Piece = vassal.module('piece');
    this.set('pieces', new Piece.PieceCollection());
  },
});

var SlotView = Backbone.View.extend({
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
      vp[piece.cid].$el.appendTo($slot);
      offset.left += 5;
      offset.top += 5;
      vp[piece.cid].$el.offset(offset);
    });
  },
  dragOver: function(e) {
    console.log('over');
    var ev = e.originalEvent;
    if (! this.model.get('allow_stacking') && this.model.get('pieces').size() > 0)
      return true;
    if (ev.preventDefault) {
      ev.preventDefault();
    }
    ev.dataTransfer.dropEffect = 'move';

    return false;
  },
  drop: function(e) {
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
