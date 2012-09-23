(function(Map) {
var Piece = vassal.module('piece');
Map.MapTile = Backbone.Model.extend({
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
    resp.tiles = new Map.TileCollection(resp.tiles);
    return resp;
  },
});

Map.MapTileView = Backbone.View.extend({
  initialize: function() {
    this.image = undefined;
  },
  events: {
    'dragstart': 'dragStart',
  },
  dragStart: function(e) {
    var ev = e.originalEvent;
    console.log('tile drag start');
    ev.dataTransfer.effectAllowed = 'move';
    draggedTileView = this;
  },
});

})(vassal.module('map'));
