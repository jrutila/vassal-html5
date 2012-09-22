(function(Map) {
var Piece = vassal.module('piece');
Map.Map = Backbone.Model.extend({
  initialize: function() {
    this.set('tiles', new Map.TileCollection())
  },
});
Map.TileCollection = Backbone.Collection.extend({
  model: Map.MapTile
});
Map.MapTile = Backbone.Model.extend({
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
