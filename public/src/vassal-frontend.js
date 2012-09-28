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
      game = new Game.Game(Game.Game.prototype.parse(data));
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

toSkulpt = function(obj) {
  var ret = null;
  if (obj.attributes != undefined)
  {
    ret = new Sk.builtin.type(null, null, null)();
    for (var key in obj.attributes)
       ret.tp$setattr(key, toSkulpt(obj.attributes[key]));
  } else if (obj.models != undefined)
  {
    ret = new Sk.builtin.list([]);
    for (var i = 0; i < obj.models.length; i++)
    {
      ret.v.push(toSkulpt(obj.models[i]));
    }
  } else if (obj.substring)
  {
    ret = Sk.builtin.str(obj.toString());
  }
  return ret;
};

$(document).ready(function() {
  $.get('/soc/actions/test.py', function(data) {
    var module = Sk.importMainWithBody('<stdin>', false, data);
    func = module.tp$getattr('test');
    gg = toSkulpt(game);
    Sk.misceval.callsim(func, gg);
  });
});
