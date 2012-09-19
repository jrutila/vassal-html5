(function(Hex) {
    Hex.Hex = Slot.extend({
    });
    Hex.HexGrid = Backbone.Collection.extend({
      hexiter: 0,
      model: Hex,

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

    Hex.HexView = SlotView.extend({
      tagName: 'div',
      className: 'slot hex',
      render: function() {
      	console.log('rendering!');
        this.$el.width(HT.Hexagon.Static.SIDE);
        this.$el.height(HT.Hexagon.Static.HEIGHT/2);
        this.$el.offset({
          top: this.options['hexgrid'].offset_y + (this.model.get('y')-1)*HT.Hexagon.Static.HEIGHT+(HT.Hexagon.Static.HEIGHT/2)*((this.model.get('x')+1)%2) + HT.Hexagon.Static.HEIGHT/4,
          left: this.options['hexgrid'].offset_x +(Math.floor(this.model.get('x')/2))*HT.Hexagon.Static.WIDTH + (Math.floor((this.model.get('x')-1)/2))*HT.Hexagon.Static.SIDE + (this.model.get('x')%2)*(HT.Hexagon.Static.WIDTH/2-HT.Hexagon.Static.SIDE/2)
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
        HT.Hexagon.Static.WIDTH = 88;
        HT.Hexagon.Static.HEIGHT = 76;
        HT.Hexagon.Static.SIDE = 44;
        var grid = new HT.Grid(1080,800);
        var ctx = this.el.getContext('2d');
        var img = new Image();
        var gridd = this.options['grid'];
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
        img.onload = function() {
          ctx.drawImage(img, -20, -20);
          for (var h in grid.Hexes) {
            var hex = grid.Hexes[h];
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
              hexgrid: hexgrid
            });
            hv.render();
          }
        }
        img.src = 'images/backdrop.png';
      }
    });
})(vassal.module('hex'));
