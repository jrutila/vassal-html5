(function(Map) {
var Piece = vassal.module('piece');
var Token = vassal.module('token');
Map.MapTile = Backbone.Model.extend({
  defaults: {
    tokens: new Token.TokenCollection(),
  },
  parse: function(resp) {
    console.log("parse tile");
    resp.tokens = new Token.TokenCollection(resp.tokens);
    return resp;
  },
});
Map.TileCollection = Backbone.Collection.extend({
  model: Map.MapTile
});
Map.Map = Backbone.Model.extend({
  initialize: function() {
    //this.set('tiles', new Map.TileCollection())
  },
  defaults: {
    tiles: new Map.TileCollection(),
  },
  parse: function(resp) {
    console.log('parse map');
    var arr = new Map.TileCollection();
    for (var i in resp.tiles)
      arr.add(new Map.MapTile.prototype.parse(resp.tiles[i]));
    resp.tiles = arr;
    return resp;
  },
});

Map.MapTileView = Backbone.View.extend({
  initialize: function() {
    this.tokens = []; // array of tokenviews
    this.$el.draggable({
      scope: 'map',
    });
    var me = this;
    this.$el.droppable({
      drop: function(ev, ui) { me.drop(ev, ui); }
    });
    this.$el.data('backbone-view', this);
    this.model.get('tokens').on('add', function(tok) { tok.moveTo(this.model); this.tokens.push(tok.get('backbone-view')); this.renderTokens(); }, this);
  },
  render: function(offset) {
    this.renderTile();
    this.renderTokens();
  },
  drop: function(ev, ui) {
    console.log('dropped something on a maptile');
    var view = $(ui.draggable).data('backbone-view');
    view.model.moveTo(this.model);
    this.renderTokens();
  },
});

})(vassal.module('map'));
