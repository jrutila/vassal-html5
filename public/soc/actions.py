import random
def randomize_tiles(game):
  tile_places = [(4,4),(3,4),(4,5),(5,5),(2,4),(3,5),(4,6),(5,6),(6,6),(2,5),(3,6),(4,7),(5,7),(6,7),(2,6),(3,7),(4,8),(5,8),(6,8)]
  for i in range(18, 37): # len(game.map.tiles)-1):
    he = random.randint(0, len(tile_places)-1)
    game.map.tiles[i].x = tile_places[he][0]
    game.map.tiles[i].y = tile_places[he][1]
    del tile_places[he]

def setup_tokens(game):
  tile_places = [(4,4),(5,5),(6,6),(6,7),(6,8),(5,8),(4,8),(3,7),(2,6),(2,5),(2,4),(3,4),(4,5),(5,6),(5,7),(4,7),(3,6),(3,5),(4,6)]
  ll = []
  for i in range(0, 18):
    tp = tile_places[i]
    update = True
    for t in game.map.tiles:
      if t.x == tp[0] and t.y == tp[1]:
        print("Found tile!")
        if t.properties.terrain == "desert":
          print("It Is desert")
          update = False
    if update:
      print("Updating")
      game.pieces[i].setLocation({ "area": "gameboard", "x": tile_places[i][0], "y": tile_places[i][1]})
