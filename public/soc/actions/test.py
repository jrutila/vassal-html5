import random
tile_places = [(1,3),(2,3),(3,3),(1,4),(2,4),(3,4),(4,4),(1,5),(2,5),(3,5),(4,5),(5,5),(2,6),(3,6),(4,6),(5,6),(3,7),(4,7),(5,7)]
def test(game):
  for i in range(18, 37): # len(game.map.tiles)-1):
    print tile_places
    print len(tile_places)
    he = random.randint(0, len(tile_places)-1)
    print he
    game.map.tiles[i].x = tile_places[he][0]
    game.map.tiles[i].y = tile_places[he][1]
    del tile_places[he]
