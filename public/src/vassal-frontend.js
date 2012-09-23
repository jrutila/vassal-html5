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

Properties = Backbone.Model.extend({
});

jQuery(function($) {
    var Game = vassal.module('game');
    var Hex = vassal.module('hex');
    $.getJSON('/soc/module.json')
      .success(function(data) {
      var game = new Game.Game(Game.Game.prototype.parse(data));
      var grid_view = new Hex.HexGridView({
        el: $('#hexCanvas'),
        model: game.get('map'),
      });

      grid_view.render();
    })
      .error(function(data, xhr) { console.log('err'); console.log(data); console.log(xhr); });


    var Piece = vassal.module('piece');
    var p = new Piece.Piece({
      parameters: { name: 'SU 1 Shock' }
    });
    var pv = new Piece.PieceView({
      model: p,
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
