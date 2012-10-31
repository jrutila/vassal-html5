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

var Game = vassal.module('game');
var Hex = vassal.module('hex');
var Piece = vassal.module('piece');

jQuery(function($) {

    var chooser = new GameChooser({ el: $("#gameChooser") });
    chooser.render();

/*
*/
});

GameChooser = Backbone.View.extend({
  tagName: 'ul',
  id: 'gameChooser',
  initialize: function() {
    this.games = [ 'soc', 'afrika' ];
    if (localStorage.games != undefined)
      _.each(localStorage.games.split(','), function(el) {
        this.games.push(el);
      }, this);
  },
  render: function() {
    for (var i = 0; i < this.games.length; i++)
    {
      var $game = $("<li>"+this.games[i]+"</li>");
      this.$el.append($game);
      $game.click(function() {
        $(this).parent().hide();
        if ($(this).html() != 'soc' && $(this).html() != 'afrika')
        {
          game = new Game.Game({id: $(this).html()});
          game.fetch();
          init_game(game);
        } else {
          $.getJSON('/'+$(this).html()+'/module.json')
            .success(function(data) {
              game = new Game.Game(Game.Game.prototype.parse(data));
              init_game(game);
            })
            .error(function(data, xhr) { console.log('err'); console.log(data); console.log(xhr); });
        }
      });
    }
  },
});

init_game = function(ggame) {
  var grid_view = new Hex.HexGridView({
    model: game.get('map'),
  });

  grid_view.render();

  var pb = new Piece.PieceBox({
    model: game.get('pieces'),
    tokens: game.get('tokens')
  });
  pb.render();
};

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
Backbone.Model.prototype.tp$str = function() { return Sk.builtin.str(this.cid); };

Backbone.Collection.prototype.mp$subscript = Backbone.Collection.prototype.at;
Backbone.Collection.prototype.iterator = function() {
  ret = Object();
  ret.ind = 0;
  ret.arr = this.models;
  ret.tp$iternext = function()
  {
    if (this.ind >= this.arr.length)
      return undefined;
    return this.arr[this.ind++];
  };
  return ret;
};
Backbone.Collection.prototype.tp$iter = Backbone.Collection.prototype.iterator;

Backbone.Collection.prototype.tp$getattr = function(key) {
  if (key == "append")
  {
    var func = function(models, options) {
      this.add(models, options);
    };
    func.context = this;
    return func;
  }
  return undefined;
};

Areas = {};

$(document).ready(function() {
  $.get('/soc/actions.py', function(data) {
    Action = vassal.module('action');
    var module = Sk.importMainWithBody('<stdin>', false, data);
    globalActionList = new Action.ActionList();
    for (pr in module.$d)
    {
      func = module.tp$getattr(pr);
      if (func instanceof Sk.builtin.func)
      {
        globalActionList.add(new Action.Action({
          func: func,
          name: pr,
        }));
      }
    }
    globalActions = new Action.GlobalActionView({
      model: globalActionList,
    });
    globalActions.render();
  });
});
