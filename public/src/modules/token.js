(function(Token) {
Token.Token = Backbone.Model.extend({
  moveTo: function(tokened) {
    console.log('moving token');
    if (this.parent != undefined)
      this.parent.get('tokens').remove(this);
    //if (this.collection != undefined)
      //this.collection.remove(this);
    this.parent = tokened;
  },
  parse: function(resp, xhr) {
    resp['properties'] = new Backbone.Model(resp["properties"]);
    return resp
  },
});

Token.TokenCollection = Backbone.Collection.extend({
  model: Token.Token,
  parse: function(resp, xhr) {
    if (resp == undefined)
      return resp;
    var ret = new Token.TokenCollection();
    for (var i = 0; i < resp.length; i++)
      ret.add(Token.Token.prototype.parse(resp[i]));
    return ret;
  },
});


Token.TokenView = Backbone.View.extend({
  tagName: "div",
  className: "token",
  initialize: function() {
    this.paper = Raphael(this.el,50,50);
    this.renderFirst();
    this.$el.data('backbone-view', this);
    this.model.tokenView = this;
  },
  renderFirst: function() {
    var svgcirc = this.paper.circle(25,25,25)
                      .attr({fill: "white"});
    var props = this.model.get('properties')
    if (props != undefined)
    {
      if (props.attributes != undefined)
        props = props.attributes
      for (var prop in props)
      {
        this.paper.text(25,10,props[prop]).attr({ "font-size": 16 });
        break;
      }
    }
    this.$el.appendTo('body');
    this.$el.draggable({ handle: 'circle' }).data('backbone-view', this);
  },
  assign: function(parentView) {
    this.model.parent = parentView.model;
  },
});
})(vassal.module('token'));
