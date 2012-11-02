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

draggedView = undefined;

})(vassal.module('slot'));
