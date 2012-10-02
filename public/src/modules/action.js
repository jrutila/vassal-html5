(function(Action) {

Action.Action = Backbone.Model.extend({
  func: undefined,
  name: '##action##',
  run: function(context) {
    Sk.misceval.callsim(this.get('func'), context);
  },
});

Action.ActionList = Backbone.Collection.extend({
  model: Action,
})

Action.ActionView = Backbone.View.extend({
  tagName: 'li',
  events: {
    "click": "runAction"
  },
  render: function() {
    var link = $('<a></a>');
    link.html(this.model.get('name'));
    this.$el.append(link);
    return this;
  },
  runAction: function(e) {
    this.model.run(game);
    return false;
  },
});

Action.GlobalActionView = Backbone.View.extend({
  tagName: 'ul',
  model: Action.ActionList,
  render: function() {
    this.$el.appendTo($('#globalActions'));
    this.model.each(function(a) {
      var vv = new Action.ActionView({
        model: a,
      });
      vv.render();
      this.$el.append(vv.$el);
    }, this);
    return this;
  },
});

})(vassal.module('action'));
