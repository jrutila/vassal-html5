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
    var Piece = vassal.module('piece');

    $.getJSON('/afrika/module.json')
      .success(function(data) {
      game = new Game.Game(Game.Game.prototype.parse(data));
      var grid_view = new Hex.HexGridView({
        el: $('#hexCanvas'),
        model: game.get('map'),
      });

      grid_view.render();

      var pb = new Piece.PieceBox({
        model: game.get('pieces')
      });
      pb.render();
    })
      .error(function(data, xhr) { console.log('err'); console.log(data); console.log(xhr); });
});

Sk.configure({
  syspath: ['assets/js/lib/skulpt/lib'],
  read: function(filename) {
    var r = $.ajax({
      async: false,
      url: filename,
    });
    if (r.status == 200)
      return r.responseText;
    else
      throw 'Not found';
  },
});

vassalObject = new Sk.builtin.type(null, null, {
"__repr__": function() {
  return this.$d.$r();
}});

Backbone.Model.prototype.tp$getattr = Backbone.Model.prototype.get;
Backbone.Model.prototype.tp$setattr = Backbone.Model.prototype.set;

Backbone.Collection.prototype.mp$subscript = Backbone.Collection.prototype.at;

$(document).ready(function() {
  $.get('/soc/actions/test.py', function(data) {
    Action = vassal.module('action');
    var module = Sk.importMainWithBody('<stdin>', false, data);
    func = module.tp$getattr('test');
    globalActionList = new Action.ActionList();
    globalActionList.add(new Action.Action({
      func: func,
      name: 'Randomize board tiles',
    }));
    globalActions = new Action.GlobalActionView({
      model: globalActionList,
    });
    globalActions.render();
  });
});
