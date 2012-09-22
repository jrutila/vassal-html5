var vassal = {
  module: function() {
    var modules = {};

    return function(name) {
      if (modules[name]) {
        return modules[name];
      }

      return modules[name] = { Views: {} };
    };
  }()
};

Properties = Backbone.Model.extend({
});

jQuery(function($) {
    /*
    $.get('bfm.xml', {}, function(xml) {
      var Hex = vassal.module('hex');
      var grid = new Hex.HexGrid([], {
        xmax: parseInt($('hexgrid', xml).attr('xmax')),
        ymax: parseInt($('hexgrid', xml).attr('ymax'))
      });
      $('hexgrid hex', xml).each(function() {
        var params = {};
        $("*", this).each(function() {
          params[$(this).attr('name')] = $(this).attr('value');
        });
        grid.add(new Hex.Hex({ parameters: params, x: parseInt($(this).attr('x')), y: parseInt($(this).attr('y')) }));
      });
      var hex_view = new Hex.HexGridView({
        el: $('#hexCanvas'),
        model: grid
      });
      hex_view.render();
    });
    */
    var Hex = vassal.module('hex');
    var grid = new Hex.HexGrid({
      xmax: 8,
      ymax: 7,
      orientation: "rotated",
      cut: [
        "0,0", "1,0", "1,1", "1,2",
        "7,0", "6,0", "7,1", "8,2",
        "3,6", "2,4", "3,5", "4,6",
        "10,6", "9,6", "9,5", "9,4"
      ]
    });
    var tile = new Hex.HexTile({
      x: 2,
      y: 0,
      properties: new Properties({
        terrain: "wood",
      }),
    });
    grid.get('tiles').add(tile);
    grid.get('tiles').add(new Hex.HexTile({
      properties: new Properties({
        terrain: "wood",
      }),
    }));
    grid.get('tiles').add(new Hex.HexTile({
      properties: new Properties({
        terrain: "wood",
      }),
    }));
    var grid_view = new Hex.HexGridView({
      el: $('#hexCanvas'),
      model: grid,
    });

    grid_view.render();

    var Piece = vassal.module('piece');
    var p = new Piece.Piece({
      parameters: { name: 'SU 1 Shock' }
    });
    var pv = new Piece.PieceView({
      model: p,
    });
    pv.render();
    p = new Piece.Piece({
      parameters: { name: 'SU 2 Shock' }
    });
    pv = new Piece.PieceView({
      model: p
    });
    pv.render();
    p.save();
});


