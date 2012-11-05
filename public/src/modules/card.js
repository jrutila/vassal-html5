(function(Card) {
var Piece = vassal.module('piece');
var Slot = vassal.module('slot');
  Card.Card = Backbone.Model.extend({
    defaults: {
      face: 0
    },
    initialize: function() {
      this.set('properties', new Backbone.Model(this.get('properties')));
      if (this.get('location') != undefined)
        this.set('location', new Slot.Location(this.get('location')));
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
    push: function(card) {
      console.log('pushing card to deck');
      this.get('cards').push(card);
    },
  });

  Card.DeckCollection = Backbone.Collection.extend({
    model: Card.Deck,
  });

  Card.CardView = Backbone.View.extend({
    model: Card.Card,
    tagName: 'div',
    className: 'card',
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
        scope: 'slot',
      }).data('draggedView', this);
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
    className: 'deck',
    initialize: function() {
      if (this.model.top() != undefined)
        this.makeTopCard();
      SetupArea(this);
      this.model.get('cards').on("add", this.makeTopCard, this);
    },
    render: function() {
      this.$el.append($('<span>'+this.model.get('properties').get('name')+'</span>'));
      this.$el.css('border', 'solid 3px black');
      this.$el.css('display', 'inline-block');
      this.$el.width(156);
      this.$el.height(256);
      this.$el.droppable({
        drop: this.drop,
        scope: 'slot',
      });
      this.$el.data('backbone-view', this);
    },
    makeTopCard: function() {
      if (this.topcard != undefined)
        this.topcard.remove();
      this.topcard = new Card.CardView({ model: this.model.top()});
      this.topcard.render();
      this.topcard.$el.css('position', 'absolute');
      this.topcard.$el.appendTo(this.$el);
      this.topcard.on('dragStart', function()
        {
          this.topcard.off('dragStart');
          this.topcard.$el.css('z-index', 2020);
          // get the top card off
          this.model.pop();
          this.topcard = undefined;
          this.makeTopCard();
        }, this);
    },
    drop: function(event, ui) {
      console.log('dropped to deck');
      var draggedView = $(ui.draggable).data("draggedView");
      var me = $(this).data('backbone-view');
      me.model.push(draggedView.model);
      draggedView.remove();
    },
  });

  Card.DeckBox = Backbone.View.extend({
    model: Card.DeckCollection,
    className: 'deckbox',
    render: function() {
      this.$el.appendTo('body');
      this.model.each(function(deck) {
        var dv = new Card.DeckView({
          model: deck,
        });
        dv.render();
        dv.$el.appendTo(this.$el);
      }, this);
      this.$el.css('top', '0px');
      this.$el.css('left', '250px');
      var offset = this.$el.offset();
      offset.top -= this.$el.height()+30;
      this.$el.offset(offset);
      this.$el.click(function() {
        var top = 0;
        if ($(this).offset().top == 0)
          top = -1*($(this).height()+30);
        $(this).animate({top: top}, 800);
      });
    },
  });
})(vassal.module('card'));
