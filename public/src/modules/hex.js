(function(Hex) {
    var Slot = vassal.module('slot');
    Hex.Hex = Slot.Slot.extend({
    });
    Hex.Vertex = Slot.Slot.extend({
    });
    Hex.Side = Slot.Slot.extend({
    });

    Hex.HexGrid = Backbone.Collection.extend({
      hexiter: 0,
      model: Hex,
      initialize: function(models, options) {
        this.xmax = options.xmax;
        this.ymax = options.ymax;
        this.orientation = options.orientation;
        this.cut = options.cut;
      },
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

    Hex.HexGridView = Backbone.View.extend({
      initialize: function() {
        this.offset_x = this.$el.position().left;
        this.offset_y = this.$el.position().top;
      },
      render: function() {
        var ratio = 0.5;
        var x = this.model.xmax;
        var y = this.model.ymax;
        var width = this.$el.width();
        var height = this.$el.height();
        if (this.model.orientation == 'rotated')
        {
          HT.Hexagon.Static.WIDTH = Math.floor(width/x);
          HT.Hexagon.Static.HEIGHT = Math.floor(height/(y/2+ratio*((y+1+y%2)/2)));
          HT.Hexagon.Static.SIDE = HT.Hexagon.Static.WIDTH*ratio;
          HT.Hexagon.Static.ORIENTATION = HT.Hexagon.Static.Rotated;
        } else {
          HT.Hexagon.Static.WIDTH = Math.floor(width/(x/2+ratio*((x+1+x%2)/2)));
          HT.Hexagon.Static.HEIGHT = Math.floor(height/(y+0.5));
          HT.Hexagon.Static.SIDE = HT.Hexagon.Static.WIDTH*ratio;
        }
        var grid = new HT.Grid(this.$el.width(),this.$el.height());
        var ctx = this.el.getContext('2d');
        var img = new Image();
        var gridd = this.model;
        var hexgrid = this;
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

        for (var h in grid.Hexes) {
          var hex = grid.Hexes[h];
          if (this.model.cut.indexOf(hex.PathCoOrdX+","+hex.PathCoOrdY) == -1)
          hex.draw(ctx);
        }
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
        */
      }
    });
})(vassal.module('hex'));
