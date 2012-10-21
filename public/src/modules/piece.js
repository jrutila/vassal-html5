(function(Piece) {
var Token = vassal.module('token');
  Piece.Piece = Backbone.Model.extend({
    initialize: function() {
      this.storage = new Offline.Storage('pieces', this);
    },
    parse: function(resp, xhr) {
      return new Piece.Piece(resp);
    },
  });

  Piece.PieceCollection = Backbone.Collection.extend({
    model: Piece,
    parse: function(resp, xhr) {
      if (resp == undefined)
        return resp;
      var ret = new Piece.PieceCollection();
      for (var i = 0; i < resp.length; i++)
        ret.add(Piece.Piece.prototype.parse(resp[i]));
      return ret;
    },
  });

  Piece.PieceView = Backbone.View.extend({
    tagName: 'div',
    className: 'piece',
    initialize: function() {
    },
    render: function() {
      this.$el.html(this.model.get('properties')['name']);
      this.$el.draggable({
        scope: 'piece',
      }).data("draggedView", this);
    },
    dragStart: function(e) {
      var ev = e.originalEvent;
      console.log('dstart');
      this.el.style.opacity = '0.7';
      ev.dataTransfer.effectAllowed = 'move';
      var dragImg = document.createElement('img');
      ev.dataTransfer.setDragImage(dragImg, 0, 0);
      this.orig_offset = this.$el.offset();
      draggedView = this;
    },
    dragEnd: function(e) {
      var ev = e.originalEvent;
      if (draggedView.enddrag != undefined)
        draggedView.enddrag(e);
      //this.$el.offset(this.orig_offset);
    },
    show_info: function(e) {
      if (this.get('info_view') == undefined)
      {
        this.set('info_view', new PieceInfo({
          model: this.model
        }));
        this.get('info_view').render();
      }
      //this.get('info_view').show();
    },
  });

  Piece.PieceInfo = Backbone.View.extend({
    tagName: 'div',
    className: 'piece_info',
    render: function() {
     // TODO: template 
     this.$el.prependTo('body');
     for (var h in this.model.get('parameters'))
     {
      this.$el.append('<div>'+h+'</div>');
     }
    },
  });

  Piece.PieceBox = Backbone.View.extend({
    model: Piece.PieceCollection,
    tagName: "div",
    events: {
      "click .hidebox": 'hide',
    },
    initialize: function() {
      this.tokens = this.options['tokens'];
    },
    render: function() {
      this.$el.appendTo("body");
      this.$el.width(200);
      this.$el.height(300);
      this.$el.css('top', '0px');
      this.$el.css('right', '0px');
      this.$el.css('background-color', '#47A347');
      this.$el.css('position', 'absolute');
      this.model.each(function(p) {
        var pv = new Piece.PieceView({ model: p});
        pv.render();
        this.$el.append(pv.$el);
      }, this);
      if (this.tokens != undefined)
        this.tokens.each(function(t) {
          var tv = new Token.TokenView({ model: t});
          tv.render();
          this.$el.append(tv.$el);
        }, this);
      this.$el.append('<div class="hidebox">X</div>')
    },
    hide: function() {
      this.$el.hide();
    },
  });

})(vassal.module('piece'));
