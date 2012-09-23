(function(Game) {
var Hex = vassal.module('hex');
Game.Game = Backbone.Model.extend({
  initialize: function() {
    this.storage = new Offline.Storage('games', this);
  },
  defaults: {
    map: undefined,
  },
  parse: function(resp, xhr) {
    console.log(resp);
    var Hex = vassal.module('hex');
    var map = eval("new "+resp.map.type+"("+resp.map.type+".prototype.parse(resp.map));");
    resp.map = map;
    return resp;
  },
});
})(vassal.module('game'));
