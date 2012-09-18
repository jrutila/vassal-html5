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
});

var Slot = Backbone.Model.extend({
  defaults: { parameters: {} }
});
