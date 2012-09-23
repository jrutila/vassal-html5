(function(Hex) {
    var Slot = vassal.module('slot');
    var Map = vassal.module('map');
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
          //top: this.options['hexgrid'].offset_y + (this.model.get('y')-1)*HT.Hexagon.Static.HEIGHT+(HT.Hexagon.Static.HEIGHT/2)*((this.model.get('x')+1)%2) + HT.Hexagon.Static.HEIGHT/4,
          //left: this.options['hexgrid'].offset_x +(Math.floor(this.model.get('x')/2))*HT.Hexagon.Static.WIDTH + (Math.floor((this.model.get('x')-1)/2))*HT.Hexagon.Static.SIDE + (this.model.get('x')%2)*(HT.Hexagon.Static.WIDTH/2-HT.Hexagon.Static.SIDE/2)
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
      initialize: function() {
        this.model.on('change', this.draw, this);
        this.paper = Raphael(this.el,this.options.settings.WIDTH, this.options.settings.HEIGHT);
        this.$el.width(this.options.settings.WIDTH);
        this.$el.height(this.options.settings.HEIGHT);
        this.$el.attr('draggable', 'true');
        // XXX: HACK remove!
        this.image = this.model.get('image');
      },
      render: function() {
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
        this.$el.appendTo("body");
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
      },
      events: {
        'dragover': 'dragOver',
        'drop': 'drop',
      },
      render: function() {
        var orie = HT.Hexagon.Orientation.Normal;
        if (this.model.get('orientation') == "rotated")
          orie = HT.Hexagon.Orientation.Rotated;
        this.grid = new HT.Grid(this.$el.width(),this.$el.height(), this.model.get('xmax'), this.model.get('ymax'), orie, this.model.get('cut'));
        var ctx = this.el.getContext('2d');
        /*
        gridd.models.sort(function(a,b) {
          var n = a.get('y') - b.get('y');
          if (n != 0)
            return n;
          var ax = parseInt(a.get('x'));
          var bx = parseInt(b.get('x'));
          if (ax%2 != 0 && bx%2 == 0)
            return -1;
          if (ax%2 == 0 && bx%2 != 0)
            return 1;
          return ax-bx;
        });
        */

        var tempsettings;
        for (var h in this.grid.Hexes) {
          var hex = this.grid.Hexes[h];
          hex.draw(ctx);
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
        this.model.get('tiles').each(function(tile) 
        {
          if (tile.get('x') == undefined || tile.get('y') == undefined)
          {
            var tv = new Hex.HexTileView({
              model: tile,
              hex: function() { return grid.GetHex(tile.get('x'), tile.get('y')) },
              settings: tempsettings,
              ctx: ctx,
            });
            tv.render();
          }
        });
        /*
          var act_x = hex.PathCoOrdX+1;
          var act_y = (hex.PathCoOrdY - Math.floor(hex.PathCoOrdX/2))+((hex.PathCoOrdX+1)%2);
          var hexx = gridd.getNextHex(act_x, act_y);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.strokeStyle = 'red';
          ctx.moveTo(hex.Points[0].X, hex.Points[0].Y);
          for(var i = 1; i < hex.Points.length; i++)
          {
            var p = hex.Points[i];
            ctx.lineTo(p.X, p.Y);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = 'red';
          ctx.font = 'bolder 8pt Trebuchet MS';
          ctx.textAlign = 'center';
          ctx.textBaseLine = 'middle';
          var text = '';
          var offset = -10;
          ctx.fillText('('+hexx.get('x')+","+hexx.get('y')+')', hex.MidPoint.X, hex.MidPoint.Y+offset);
          offset += 10;
          _(hexx.get('parameters')).each(function(t) {
            ctx.fillText(t, hex.MidPoint.X, hex.MidPoint.Y+offset);
            offset += 10;
          });
          var hv = new Hex.HexView({
            model: hexx,
            point: hex.MidPoint,
            hexgrid: hexgrid
          });
          hv.render();
        }
        */
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
      drop: function(e) {
        console.log('dropped');
        var ev = e.originalEvent;
        var hex = this.grid.GetHexAt(new HT.Point(ev.offsetX, ev.offsetY));
        draggedTileView.model.set({x: hex.GridX}, {silent: true});
        draggedTileView.model.set({y: hex.GridY});
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
