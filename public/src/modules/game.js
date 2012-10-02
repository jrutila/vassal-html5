(function(Game) {
var Hex = vassal.module('hex');
var Piece = vassal.module('piece');

Game.Game = Backbone.Model.extend({
  initialize: function() {
    this.storage = new Offline.Storage('games', this);
  },
  defaults: {
    map: undefined,
    pieces: new Piece.PieceCollection(),
  },
  parse: function(resp, xhr) {
    var Hex = vassal.module('hex');
    var map = eval("new "+resp.map.type+"("+resp.map.type+".prototype.parse(resp.map));");
    resp.map = map;
    resp.pieces = Piece.PieceCollection.prototype.parse(resp.pieces);
    return resp;
  },
});
})(vassal.module('game'));
