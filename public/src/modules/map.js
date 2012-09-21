(function(Map) {
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
})(vassal.module('map'));
