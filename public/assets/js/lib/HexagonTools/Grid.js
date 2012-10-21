/**
 * A Grid is the model of the playfield containing hexes
 * @constructor
 */
HT.Grid = function(/*double*/ width, /*double*/ height, xmax, ymax, xdir, ydir, orientation, cut, offsetTune) {
	
	this.Hexes = [];
	this.Vertices = [];
	this.Sides = [];
	//setup a dictionary for use later for assigning the X or Y CoOrd (depending on Orientation)
	var HexagonsByXOrYCoOrd = {}; //Dictionary<int, List<Hexagon>>

        if (offsetTune == undefined)
        {
	  offsetTune = Object();
	  offsetTune.x = 0;
	  offsetTune.y = 0;
	}

	var vertices = {};
	var sides = {};
	var hexes = [];
        var ratio = 0.5;
        var settings = new HT.Hexagon.Settings();
        if (orientation == HT.Hexagon.Orientation.Rotated)
        {
          WIDTH = Math.floor(width/xmax);
          HEIGHT = Math.floor(height/(ymax/2+ratio*((ymax+1+ymax%2)/2)));
          SIDE = HEIGHT*ratio;
          ORIENTATION = HT.Hexagon.Orientation.Rotated;
        } else {
          WIDTH = width/(Math.ceil(xmax/2)+Math.floor(xmax/2)*ratio);
          HEIGHT = Math.floor(height/ymax);
          SIDE = WIDTH*ratio;
          ORIENTATION = HT.Hexagon.Orientation.Normal;
        }

        HT.Hexagon.Static.HEIGHT = HEIGHT;
        HT.Hexagon.Static.WIDTH = WIDTH;
        HT.Hexagon.Static.SIDE = SIDE;
        HT.Hexagon.Static.ORIENTATION = ORIENTATION;
        settings.HEIGHT = HEIGHT;
        settings.WIDTH = WIDTH;
        settings.ORIENTATION = ORIENTATION
        settings.SIDE = SIDE;
        settings.OFFSET = offsetTune;

        console.log(ymax);
        console.log(height);
        console.log(HEIGHT);

        var y = 0.0;
        if (ydir == 90)
          y = height-HEIGHT;
        else
	  y = 0.0;

        var colMove = function(coly) { throw "NotImplemented"; };
	if(ORIENTATION == HT.Hexagon.Orientation.Normal)
	  if (ydir == 90)
	    colMove = function(coly) { return coly - HEIGHT / 2; };
	  else if (ydir == 315)
	    colMove = function(coly) { return coly + HEIGHT / 2; };
	else
		colMove = function(coly) { return coly + (HEIGHT - SIDE) / 2 + SIDE; };

        var ordcut = {};
        var lastcy = 0;
        for (var c in cut)
        {
          var cx = parseInt(cut[c].split(',')[0]);
          var cy = parseInt(cut[c].split(',')[1]);
          cx = cx-1;
          if (ydir == 90)
            cy = Math.ceil((cx-1)/2)+(cy-(cx+1)%2)
          else if (ydir == 315)
            cy = cy-1;
          if (!(cy in ordcut))
            ordcut[cy] = [];
          ordcut[cy].push(cx);
          if (cy > lastcy)
            lastcy = cy;
        }
        for (var c in ordcut)
        {
          ordcut[c].sort();
        }
        var iscut = function(x, y) {
          if (ydir == 90)
            if (y > lastcy)
              return true;
          if (y in ordcut)
          {
            var p = ordcut[y][0];
            var cutting = true;
            if (ydir == 90)
              cutting = true;
            else if (ydir == 315)
              cutting = false;
            for(var a = 0; a < ordcut[y].length; a++)
            {
              if (x == ordcut[y][a]) 
                return true;
              if (x < ordcut[y][a])
                return cutting;
              if (ordcut[y][a+1] - ordcut[y][a] > 1)
                cutting = !cutting;
            }
          }
          return false;
        };

        console.log(ordcut);

	var row = 0;
        for (var i = 0; i <= ymax*2; i++)
	{
		var col = 0;

		var offset = 0.0;
		if (row % 2 == 1)
		{
			if(ORIENTATION == HT.Hexagon.Orientation.Normal)
				offset = (WIDTH - SIDE)/2 + SIDE;
			else
				offset = WIDTH / 2;
			col = 1;
		}
		
		var x = offset;
		var target = Math.ceil(xmax/2)-col;
                for (var j = 0; j < target; j++)
		{
		    var skip = false;
		    var hexId = this.GetHexId(row, col);
			var h = new HT.Hexagon(hexId, x + offsetTune.x, y + offsetTune.y, settings);
			
			var pathCoOrd = col;
			if(ORIENTATION == HT.Hexagon.Orientation.Normal)
			{
				h.PathCoOrdX = col;
				h.PathCoOrdY = Math.floor(col/2)+Math.ceil(row/2);
				h.GridX = col+1;
				if (ydir == 90)
				  h.GridY = Math.floor(row/2)+1;
				else if (ydir == 315)
				  h.GridY = Math.floor(col/2)+Math.ceil(row/2)+1;
			}
			else {
				h.PathCoOrdY = row;
				pathCoOrd = row;
			}

			if (!iscut(h.PathCoOrdX, h.PathCoOrdY))
			{
			  hexes.push(h);
			  for (var p in h.Points)
			  {
			    var xplus = 0;
			    var yplus = 0;
			    vertices[h.Points[p].X + "," + h.Points[p].Y] = h.Points[p];
			    if (ORIENTATION == HT.Hexagon.Orientation.Normal)
			    {
			      switch(p)
			      {
			        case "5":
			          yplus -= HEIGHT/2;
			        case "4":
			          xplus -= SIDE/2 + (WIDTH-SIDE)/4;
			          yplus -= HEIGHT/4;
			        case "3":
			          xplus -= SIDE/2 + (WIDTH-SIDE)/4;
			          yplus += HEIGHT/4;
			        case "2":
			          yplus += HEIGHT/2;
			        case "1":
			          xplus += SIDE/2 + (WIDTH-SIDE)/4;
			          yplus += HEIGHT/4;
			        case "0":
			          xplus += SIDE/2;
			      }
			    } else {
			      switch(p)
			      {
			        case "5":
			          yplus -= SIDE/2 + (HEIGHT-SIDE)/4;
			          xplus += WIDTH/4;
			        case "4":
			          xplus -= WIDTH/4;
			          yplus -= SIDE/2 + (HEIGHT-SIDE)/4;
			        case "3":
			          xplus -= WIDTH/2;
			        case "2":
			          xplus -= WIDTH/4;
			          yplus += SIDE/2 + (HEIGHT-SIDE)/4;
			        case "1":
			          xplus += WIDTH/4;
			          yplus += SIDE/2 + (HEIGHT-SIDE)/4;
			        case "0":
			          xplus += WIDTH/4;
			          yplus += (HEIGHT-SIDE)/4;
			      }
			    }
			    var point = new HT.Point(h.Points[0].X + xplus, h.Points[0].Y + yplus);
			    var start = h.Points[p];
			    var end = h.Points[parseInt(p)+1];
			    if (end == undefined)
			      end = h.Points[0];
			    sides[start.X + "," + start.Y+","+end.X+","+end.Y] = point;
			  }
			  
			  if (!HexagonsByXOrYCoOrd[pathCoOrd])
				  HexagonsByXOrYCoOrd[pathCoOrd] = [];
			  HexagonsByXOrYCoOrd[pathCoOrd].push(h);
			}

			col+=2;
			if(ORIENTATION == HT.Hexagon.Orientation.Normal)
				x += WIDTH + SIDE;
			else
				x += WIDTH;
		}
		row++;
		y = colMove(y);
	}

	//finally go through our list of hexagons by their x co-ordinate to assign the y co-ordinate
	/*
	for (var coOrd1 in HexagonsByXOrYCoOrd)
	{
		var hexagonsByXOrY = HexagonsByXOrYCoOrd[coOrd1];
		var coOrd2 = Math.floor(coOrd1 / 2) + (coOrd1 % 2);
		for (var i in hexagonsByXOrY)
		{
			var h = hexagonsByXOrY[i];//Hexagon
			if(HT.Hexagon.Static.ORIENTATION == HT.Hexagon.Orientation.Normal)
				h.PathCoOrdY = coOrd2++;
			else
				h.PathCoOrdX = coOrd2++;
		}
	}
	*/

	for (var v in vertices)
	  this.Vertices.push(vertices[v]);
	for (var s in sides)
	  this.Sides.push(sides[s]);
	for (var h in hexes)
	{
	  var hex = hexes[h];
	  //if (cut == undefined || cut.indexOf(hex.PathCoOrdX+","+hex.PathCoOrdY) == -1)
	    this.Hexes.push(hexes[h]);
	}
};

HT.Grid.Static = {Letters:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'};

HT.Grid.prototype.GetHexId = function(row, col) {
	var letterIndex = row;
	var letters = "";
	while(letterIndex > 25)
	{
		letters = HT.Grid.Static.Letters[letterIndex%26] + letters;
		letterIndex -= 26;
	}
		
	return HT.Grid.Static.Letters[letterIndex] + letters + (col + 1);
};

/**
 * Returns a hex at a given point
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexAt = function(/*Point*/ p) {
	//find the hex that contains this point
	for (var h in this.Hexes)
	{
		if (this.Hexes[h].Contains(p))
		{
			return this.Hexes[h];
		}
	}

	return null;
};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {number}
 */
HT.Grid.prototype.GetHexDistance = function(/*Hexagon*/ h1, /*Hexagon*/ h2) {
	//a good explanation of this calc can be found here:
	//http://playtechs.blogspot.com/2007/04/hex-grids.html
	var deltaX = h1.PathCoOrdX - h2.PathCoOrdX;
	var deltaY = h1.PathCoOrdY - h2.PathCoOrdY;
	return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
};

/**
 * Returns a distance between two hexes
 * @this {HT.Grid}
 * @return {HT.Hexagon}
 */
HT.Grid.prototype.GetHexById = function(id) {
	for(var i in this.Hexes)
	{
		if(this.Hexes[i].Id == id)
		{
			return this.Hexes[i];
		}
	}
	return null;
};

HT.Grid.prototype.GetHex = function(x, y) {
	for(var i in this.Hexes)
	{
		if(this.Hexes[i].GridX == x && this.Hexes[i].GridY == y)
		{
			return this.Hexes[i];
		}
	}
	return null;
};
