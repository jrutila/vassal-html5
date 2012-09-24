(function(Token) {
Token.Token = Backbone.Model.extend({
});
Token.TokenCollection = Backbone.Collection.extend({
  model: Token.Token,
});


Token.TokenView = Backbone.View.extend({
  tagName: "div",
  className: "token",
  initialize: function() {
    this.paper = Raphael(this.el,100,100);
    this.renderFirst();
  },
  renderFirst: function() {
    var svgcirc = this.paper.circle(50,50,25)
                      .attr({fill: "white"});
    this.paper.text(50,25,'8').attr({ "font-size": 16 });
    this.$el.appendTo('body');
    this.$el.attr('draggable', 'true');
    this.$el.height(100);
    this.$el.width(100);
    this.$el.css("z-index", 9999);
  },
  assign: function(parentView) {
    this.model.parent = parentView.model;
  },
});
})(vassal.module('token'));
