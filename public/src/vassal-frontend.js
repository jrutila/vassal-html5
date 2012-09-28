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

Backbone.Model.prototype.merge = function(json) {
  var changed = false;
  for (var k in json)
  {
    console.log(k+" = "+json[k]);
    if (this.has(k))
    {
      var oldv = this.get(k);
      if (oldv.merge && oldv.merge(json[k]))
      {
        this.set(k, oldv);
        changed = true;
      }
      else if (oldv != json[k])
      {
        this.set(k, json[k]);
        changed = true;
      }
    } else {
      this.set(k, json[k]);
    }
  }
  return changed;
};

Backbone.Collection.prototype.merge = function(json) {
  var changed = false;
  for (var k in json)
  {
    var oldv = this.models[k];
    if (oldv.merge && oldv.merge(json[k]))
    {
      changed = true;
    }
    else if (oldv != json[k])
    {
      this.remove(oldv);
      this.push(json[k]);
      changed = true;
    }
  }
  return changed;
};

toSkulpt = function(obj) {
  var ret = null;
  if (obj.attributes != undefined)
  {
    ret = vassalObject();
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
  } else
  {
    var type = Sk.builtin.type(obj, undefined, undefined);
    if (type == undefined)
    {
      ret = Sk.builtin.dict({});
      for (var i in obj)
        ret.mp$ass_subscript(toSkulpt(i), toSkulpt(obj[i]));
    } else 
      ret = obj;
  }
  return ret;
};

$(document).ready(function() {
  $.get('/soc/actions/test.py', function(data) {
    var module = Sk.importMainWithBody('<stdin>', false, data);
    func = module.tp$getattr('test');
    gg = toSkulpt(game);
    Sk.misceval.callsim(func, gg);
    ggjson = JSON.parse(Sk.misceval.objectRepr(gg).v.replace(/'/g, '"'));
    game.merge(ggjson);
  });
});
