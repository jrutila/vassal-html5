(function(Hex) {
    var Slot = vassal.module('slot');
    var Map = vassal.module('map');
    var Token = vassal.module('token');
    var Piece = vassal.module('piece');

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

    Hex.GridSlotView = Slot.SlotView.extend({
        _renderPiece: function(piece_view, offset) {
            var $piece = piece_view.$el;
            var $slot = this.$el;
            $piece.appendTo($slot);
            var left = $slot.width()/2 - $piece.width()/2;
            var top = $slot.height()/2 - $piece.height()/2;
            $piece.css("top", top+"px");
            $piece.css("left", left+"px");
        },
    });

    Hex.HexView = Hex.GridSlotView.extend({
      tagName: 'div',
      className: 'slot hex',
      render: function() {
      	console.log('rendering hex!');
        this.$el.width(HT.Hexagon.Static.WIDTH/4);
        this.$el.height(HT.Hexagon.Static.HEIGHT/4);
        this.$el.offset({
          top: this.options['hexgrid'].$el.offset().top + this.options['point'].Y - HT.Hexagon.Static.HEIGHT/8,
          left: this.options['hexgrid'].$el.offset().left + this.options['point'].X - HT.Hexagon.Static.WIDTH/8,
        });
        $('body').append(this.$el);
      },
    });

    Hex.VertexView = Hex.GridSlotView.extend({
      tagName: 'div',
      className: 'slot vertex',
      render: function() {
      	console.log('rendering vertex!');
        this.$el.width(HT.Hexagon.Static.WIDTH/4);
        this.$el.height(HT.Hexagon.Static.HEIGHT/4);
        this.$el.offset({
          top: this.options['hexgrid'].$el.offset().top + this.options['point'].Y - HT.Hexagon.Static.HEIGHT/8,
          left: this.options['hexgrid'].$el.offset().left + this.options['point'].X - HT.Hexagon.Static.WIDTH/8,
        });
        $('body').append(this.$el);
      },
    });

    Hex.SideView = Hex.GridSlotView.extend({
      tagName: 'div',
      className: 'slot side',
      render: function() {
      	console.log('rendering side!');
        this.$el.width(HT.Hexagon.Static.WIDTH/4);
        this.$el.height(HT.Hexagon.Static.HEIGHT/4);
        this.$el.offset({
          top: this.options['hexgrid'].$el.offset().top + this.options['point'].Y - HT.Hexagon.Static.HEIGHT/8,
          left: this.options['hexgrid'].$el.offset().left + this.options['point'].X - HT.Hexagon.Static.WIDTH/8,
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
        });
        this.tokens.push(tview);
      },
      renderTokens: function() {
        console.log('rendering tokens');
        xpl = 0;
        _.each(this.tokens, function(token_view) {
          if (token_view === undefined)
            return;
          var os = this.$el.offset();
          os.left += this.$el.width()/5;
          os.top += this.$el.height()/5;
          if (os != null)
          {
            os.left += xpl;
            os.top += xpl;
            token_view.$el.offset(os);
            token_view.$el.css('z-index', parseInt(this.$el.css('z-index'))+1+xpl);
          }
          xpl += 5;
          console.log('token rendered');
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

    Hex.HexGridView = Map.MapView.extend({
      tagName: "canvas",
      initialize: function() {
        this.setupArea();
        this.offset_x = this.$el.position().left;
        this.offset_y = this.$el.position().top;

        var orie = HT.Hexagon.Orientation.Normal;
        var image_offset = { x: 0, y: 0};
        if (this.model.get('image') != undefined)
          image_offset = this.model.get('image').offset;
        if (this.model.get('orientation') == "rotated")
          orie = HT.Hexagon.Orientation.Rotated;
        this.grid = new HT.Grid(
          this.model.get('width'),
          this.model.get('height'),
          this.model.get('xmax'),
          this.model.get('ymax'),
          this.model.get('x'),
          this.model.get('y'),
          orie,
          this.model.get('cut'),
          image_offset
        );

        this.$el.data('backbone-view', this);
        this.$el.droppable({
          scope: 'map',
          drop: this.drop
        });
      },
      renderPiece: function(piece_view) {
        var loc = piece_view.model.get('location');
        var slot = undefined;
        if (loc.get('hextype') == undefined || loc.get('hextype') == "hex")
        {
          var hex = this.grid.GetHex(loc.get('x'), loc.get('y'));
          slot = this.slots[hex.Id];
        }
        else if (loc.get('hextype') == "vertex" || loc.get('hextype') == "side")
          slot = this.slots[loc.get('x')+","+loc.get('y')];
        if (slot != undefined)
          slot.renderPiece(piece_view);
      },
      render: function() {
        console.log("rendering map hexgrid");
 
        this.$el.attr('width', this.model.get('width'));
        this.$el.attr('height', this.model.get('height'));
        this.$el.appendTo('body');
        this.drawBase(this.el.getContext('2d'));

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

        this.slots = {};

        var hexgrid = this;
        if (this.model.get('slots').indexOf('hex') > -1)
        {
          async.forEach(grid.Hexes, function(hex) {
            var hh = new Hex.HexView({
              point: hex.MidPoint,
              hexgrid: hexgrid,
              location: { "area": hexgrid.model.get("area"), "hextype": "hex", "x": hex.GridX, "y": hex.GridY }
            });
            hh.render();
            hexgrid.slots[hex.Id] = hh;
          }, this);
        }
        if (this.model.get('slots').indexOf('vertex') > -1)
        {
          for (var v in grid.Vertices) {
              var vertex = grid.Vertices[v];
              var vv = new Hex.VertexView({
                point: vertex,
                hexgrid: this,
                location: { "area": hexgrid.model.get("area"), "hextype": "vertex", "x": vertex.X, "y": vertex.Y }
              });
              hexgrid.slots[vertex.X+","+vertex.Y] = vv;
              vv.render();
          }
        }
        if (this.model.get('slots').indexOf('side') > -1)
        {
          for (var v in grid.Sides) {
            var side = grid.Sides[v];
            var sv = new Hex.SideView({
              point: side,
              hexgrid: this,
              location: { "area": hexgrid.model.get("area"), "hextype": "side", "x": side.X, "y": side.Y }
            });
            hexgrid.slots[side.X+","+side.Y] = sv;
            sv.render();
          }
        }
      },
      drawBase: function(ctx) {
        console.debug('drawing base');
        var hexes = this.grid.Hexes;
        var drawHexes = function(ctx) {
          for (var h in hexes) {
            var hex = hexes[h];
            hex.draw(ctx);
          }
        };
        if (this.model.get('image') == undefined)
        {
          drawHexes(ctx);
          return;
        }
        var img = new Image();
        img.onload = function() {
          ctx.drawImage(this, 0, 0);
          drawHexes(ctx);
        };
        img.onerror = function() {
          drawHexes(ctx);
        };
        if (this.model.get('image') != undefined)
          img.src = this.model.get('image').src;
        else
          drawHexes(ctx);
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
