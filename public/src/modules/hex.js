(function(Hex) {
    var Slot = vassal.module('slot');
    var Map = vassal.module('map');
    var Token = vassal.module('token');
    Hex.Hex = Slot.Slot.extend({
    });
    Hex.Vertex = Slot.Slot.extend({
    });
    Hex.Side = Slot.Slot.extend({
    });

    Hex.HexTile = Map.MapTile.extend({
    });

    Hex.HexGrid = Map.Map.extend({
      type: 'Hex.HexGrid',
      hexiter: 0,
      getNextHex: function(x, y) {
        if (this.hexiter == -1)
          this.hexiter = 0;
        var cand = this.models[this.hexiter];
        if (cand != undefined && cand.get('x') == x && cand.get('y') == y)
        {
          this.hexiter++;
          return cand;
        }
        return new Hex.Hex({ x: x, y: y});
      }
    });

    Hex.HexView = Slot.SlotView.extend({
      tagName: 'div',
      className: 'slot hex',
      render: function() {
      	console.log('rendering!');
        this.$el.width(HT.Hexagon.Static.SIDE);
        this.$el.height(HT.Hexagon.Static.HEIGHT/2);
        this.$el.offset({
          top: this.options['hexgrid'].offset_y + this.options['point'].Y - HT.Hexagon.Static.HEIGHT/4,
          left: this.options['hexgrid'].offset_x + this.options['point'].X - HT.Hexagon.Static.WIDTH/4,
        });
        $('body').append(this.$el);
      },
    });

    Hex.VertexView = Slot.SlotView.extend({
      tagName: 'div',
      className: 'slot vertex',
      render: function() {
      	console.log('rendering vertex!');
        this.$el.width(HT.Hexagon.Static.WIDTH/4);
        this.$el.height(HT.Hexagon.Static.HEIGHT/4);
        this.$el.offset({
          top: this.options['hexgrid'].offset_y + this.options['point'].Y - HT.Hexagon.Static.HEIGHT/8,
          left: this.options['hexgrid'].offset_x + this.options['point'].X - HT.Hexagon.Static.WIDTH/8,
        });
        $('body').append(this.$el);
      },
    });

    Hex.SideView = Slot.SlotView.extend({
      tagName: 'div',
      className: 'slot side',
      render: function() {
      	console.log('rendering side!');
        this.$el.width(HT.Hexagon.Static.WIDTH/4);
        this.$el.height(HT.Hexagon.Static.HEIGHT/4);
        this.$el.offset({
          top: this.options['hexgrid'].offset_y + this.options['point'].Y - HT.Hexagon.Static.HEIGHT/8,
          left: this.options['hexgrid'].offset_x + this.options['point'].X - HT.Hexagon.Static.WIDTH/8,
        });
        $('body').append(this.$el);
      },
    });

    Hex.HexTileView = Map.MapTileView.extend({
      tagName: "div",
      className: "maptile",
      initialize: function(options) {
        this.constructor.__super__.initialize.apply(this, [options]);
        this.model.on('change', this.render, this);
        this.paper = Raphael(this.el,this.options.settings.WIDTH, this.options.settings.HEIGHT);
        this.$el.width(this.options.settings.WIDTH);
        this.$el.height(this.options.settings.HEIGHT);
        this.$el.attr('draggable', 'true');
        // XXX: HACK move image to something else!
        this.image = this.model.get('image');
        this.renderFirst();
        this.model.get('tokens').each(this.addToken, this);
      },
      renderFirst: function() {
        if (this.image != undefined)
          this.svgimage = this.paper.image(this.image.src,0,0,this.options.settings.WIDTH, this.options.settings.HEIGHT);
        else
        {
          var width = this.options.settings.WIDTH;
          var height = this.options.settings.HEIGHT;
          var side = this.options.settings.SIDE;
          var args = [width/2, 0, width, (height-side)/2, width, height-(height-side)/2,width/2,height,0,height-(height-side)/2, 0, (height-side)/2]
          var svgpic = this.paper.path("M{0} {1}L{2} {3}L{4} {5}L{6} {7}L{8} {9}Z".format(args));
        }
      },
      renderTile: function() {
        var os = this.options.offset();
        if (os != null)
        {
          console.log('rendering tile');
          this.$el.css('position', 'absolute');
          this.$el.offset(os);
        }
        else
          this.$el.css('position', 'relative');
        this.$el.appendTo("body");
      },
      addToken: function(token) {
        console.log('adding token');
        var $elm = this.$el;
        var tview = new Token.TokenView({
          model: token,
          offset: function() { return $elm.offset(); },
        });
        this.tokens.push(tview);
      },
      renderTokens: function() {
        _.each(this.tokens, function(token_view) {
          var os = token_view.options.offset();
          if (os != null)
          {
            token_view.$el.offset(os);
          }
        }, this);
      },
      draw: function() {
          var hex = this.options.hex;
          if (_.isFunction(hex))
            hex = hex();
          var model = this.model;
          var ctx = this.options.ctx;
          var drawInfo = function() {
            ctx.fillText('terrain = '+model.get('properties')['terrain'], hex.MidPoint.X, hex.MidPoint.Y+30);
          };
          this.$el.hide();
          if (this.svgimage)
          {
            var img = new Image();
            img.onload = function() {
              ctx.drawImage(img, hex.TopLeftPoint.X, hex.TopLeftPoint.Y, hex.settings.WIDTH, hex.settings.HEIGHT);
              drawInfo();
            };
            img.src = this.svgimage.attr('src');
          } else {
            drawInfo();
          }
      },
    });

    Hex.HexGridView = Backbone.View.extend({
      initialize: function() {
        this.offset_x = this.$el.position().left;
        this.offset_y = this.$el.position().top;

        var orie = HT.Hexagon.Orientation.Normal;
        if (this.model.get('orientation') == "rotated")
          orie = HT.Hexagon.Orientation.Rotated;
        this.grid = new HT.Grid(this.$el.width(),this.$el.height(), this.model.get('xmax'), this.model.get('ymax'), orie, this.model.get('cut'));

        this.$el.data('backbone-view', this);
        this.$el.droppable({
          drop: this.drop
        });
      },
      render: function() {
        this.drawBase(this.el.getContext('2d'));
        console.log("rendering map hexgrid");

        var settings = this.grid.Hexes[0].settings;
        var grid = this.grid;
        var $elm = this.$el;
        this.model.get('tiles').each(function(tile) 
        {
          var tv = new Hex.HexTileView({
            model: tile,
            hex: function() { return grid.GetHex(tile.get('x'), tile.get('y')); },
            settings: settings,
            offset: function() {
              if (tv.options.hex() == null)
                return null;
              return {
                left: $elm.offset().left + tv.options.hex().TopLeftPoint.X,
                top: $elm.offset().top + tv.options.hex().TopLeftPoint.Y
              };
            }
          });
          tv.render();
        }, this);
 
      },
      drawBase: function(ctx) {
        console.debug('drawing base');
        for (var h in this.grid.Hexes) {
          var hex = this.grid.Hexes[h];
          hex.draw(ctx);
        }
      },
      draw: function() {
        for (var h in this.grid.Hexes) {
          var hextile = this.model.get('tiles').find(function(data) { return data.get('x') == hex.GridX && data.get('y') == hex.GridY; });
          if (hextile)
          {
            var tv = new Hex.HexTileView({
              model: hextile,
              hex: hex,
              settings: hex.settings,
              ctx: ctx,
            });
            tv.render();
            tv.draw(ctx, hex.MidPoint);
          }
          tempsettings = hex.settings;
        }
        var grid = this.grid;
       var hexgrid = this;
        for (var v in grid.Vertices) {
            var vv = new Hex.VertexView({
              model: new Hex.Vertex(),
              point: grid.Vertices[v],
              hexgrid: hexgrid
            });
            vv.render();
        }
        for (var v in grid.Sides) {
          var sv = new Hex.SideView({
            model: new Hex.Side(),
            point: grid.Sides[v],
            hexgrid: hexgrid
          });
          sv.render();
        }
      },
      dragOver: function(e) {
        var ev = e.originalEvent;
        if (ev.preventDefault) {
          ev.preventDefault();
        }
        return false;
      },
      drop: function(ev, ui) {
        var left = ui.offset.left;
        var top = ui.offset.top;
        console.log('dropped to hexgrid '+left+" "+top);
        var hex = $(this).data('backbone-view').grid.GetHexAt(new HT.Point(left, top));
        if (hex == null)
        {
          ev.revert = true;
          return false;
        }
        var model = $(ui.draggable).data('backbone-view').model;
        model.set({x: hex.GridX}, {silent: true});
        model.set({y: hex.GridY});
      },
    });
})(vassal.module('hex'));
String.prototype.format = function() {
  var formatted = this;
  for(arg in arguments) {
    formatted = formatted.replace("{" + arg + "}", arguments[arg]);
  }
  return formatted;
};
