(function(Card) {
  Card.Card = Backbone.Model.extend({
    defaults: {
      face: 0
    },
    initialize: function() {
      this.set('properties', new Backbone.Model(this.get('properties')));
    },
  });

  Card.CardCollection = Backbone.Collection.extend({
    model: Card.Card,
  });

  Card.Deck = Backbone.Model.extend({
    initialize: function() {
      this.set('cards', new Card.CardCollection(this.get('cards')));
      this.set('properties', new Backbone.Model(this.get('properties')));
    },
    top: function() {
      return this.get('cards').last();
    },
    pop: function() {
      return this.get('cards').pop();
    },
  });

  Card.DeckCollection = Backbone.Collection.extend({
    model: Card.Deck,
  });

  Card.CardView = Backbone.View.extend({
    model: Card.Card,
    tagName: 'div',
    initialize: function() {
      this.model.on('change:face', this.renderFace, this);
    },
    render: function() {
      this.$el.css('border', 'solid 2px red');
      this.$el.width(150);
      this.$el.height(250);
      var me = this;
      this.$el.draggable({
        start: function() {
          me.trigger('dragStart');
        },
        stop: function() {
        },
      });
      this.$el.click(function() {
        me.model.set('face', (me.model.get('face')+1)%2);
      });
      this.renderFace();
    },
    renderFace: function() {
      if (this.model.get('face') == 0) {
        this.$el.css('background-color', 'gray');
        this.$el.html('');
      } else {
        this.$el.css('background-color', 'white');
        this.$el.html(this.model.get('properties').get('name'));
      }
    },
  });

  Card.DeckView = Backbone.View.extend({
    model: Card.Deck,
    tagName: 'div',
    initialize: function() {
      this.makeTopCard();
      SetupArea(this);
    },
    render: function() {
      this.$el.appendTo('body');
      this.$el.append('DECK OF CARDS '+this.model.get('properties').get('name'));
      this.$el.css('border', 'solid 3px black');
      this.$el.css('display', 'inline-block');
      this.$el.width(156);
      this.$el.height(256);
      this.$el.css("position", "absolute");
      this.$el.css("top", "350px");
      this.$el.css("right", "20px");
    },
    makeTopCard: function() {
      this.topcard = new Card.CardView({ model: this.model.top()});
      this.topcard.render();
      this.topcard.$el.css('position', 'absolute');
      this.topcard.$el.appendTo('body');
      this.topcard.on('dragStart', function()
        {
          console.log('drawing card');
          this.topcard.off('dragStart');
          this.model.pop();
          this.makeTopCard();
        }, this);
    },
  });
})(vassal.module('card'));
