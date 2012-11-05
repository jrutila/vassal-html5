(function(Slot) {

Slot.Location = Backbone.Model.extend({
  initialize: function() {
    this.on("change", function() {
      console.log("loc change");
      });
  },
});


Slot.SlotView = Backbone.View.extend({
  _viewPointers: {},
  defaults: {
    allow_stacking: true,
  },
  initialize: function() {
    this.$el.data('backbone-view', this);
    this.$el.droppable({
      scope: 'slot',
      drop: this.drop,
    });
  },
  renderTo: function(piece) {
      this._renderTo(piece);
  },
  drop: function(event, ui) {
    console.log('dropped to slot');
    var draggedView = $(ui.draggable).data("draggedView");
    var me = $(this).data('backbone-view');
    console.log(me.options['location']);
    draggedView.model.set('location', new Slot.Location(me.options['location']));
  },
});

Offboard = Backbone.View.extend({
  renderTo: function(piece_view) {
    console.log('offboard render');
    piece_view.$el.appendTo('body');
    piece_view.$el.css('position', 'static');
    var os = new Object();
    os.left = piece_view.model.get('location').get('x');
    os.top = piece_view.model.get('location').get('y');
    piece_view.$el.offset(os);
  }
});

$(document).ready(function() {
  $('body').droppable({
    scope: 'slot',
    drop: function(ev, ui) {
      var draggedView = $(ui.draggable).data("draggedView");
      draggedView.model.set('location', new Slot.Location({
        "area": "offboard",
        "x": ui.offset.left,
        "y": ui.offset.top 
      }));
    },
  });
  Areas['offboard'] = new Offboard();
});


draggedView = undefined;

})(vassal.module('slot'));
