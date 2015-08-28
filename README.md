# Scruffy Labrador

A graph implementation in Javascript, with a focus on representing,
creating, and visualizing mazes.

Like its namesake, it doesn't look like much, but it's there when you
need it!

## Usage

First, concatenate the source files using `rake`:

    $ rake build

This will generate a file called `scruffy-labrador.js`. Include this
on your webpage:

    <script type="text/javascript" src="scruffy-labrador.js"></script>

Initialize a grid by requiring the appropriate modules:

    var Grid = require('grid').Grid;
    var Layout = require('layout/orthogonal').Layout;

    // a grid of 10 rows and 20 columns
    var grid = new Grid(new Layout(10, 20));

Generate a maze:

    var Backtracker = require('algorithm/recursive_backtracker').Algorithm;
    new Backtracker().run(grid);

Generate geometry for the maze:

    var Outlines = require('geometry/orthogonal/outlines').Outlines;

    // build the geometry so that each cell is 20 units (pixels)
    // on a side.
    var geometry = new Outlines(grid, 20);

Draw the given geometry onto an HTML canvas element (assuming it has
an id of "maze"):

    var canvas = document.getElementById('maze');
    var ctx = canvas.getContext('2d');

    // Mazes of up to 4-dimensions can be created. As this is
    // just a two dimensional maze, we only want the layers from
    // "world" 0, "level" 0.
    //
    // Layers are just arrays of elements, which should be drawn
    // in the given order so that z-ordering is respected.
    var layers = geometry.layers[0][0];

    for(var i = 0; i < layers.length; i++) {
      var layer = layers[i];
      for(var j = 0; j < layer.length; j++) {
        var element = layer[j];
        element.render(ctx);
      }
    }

While they aren't implemented yet, the architecture is such that grids
of various (non-orthogonal) geometries can be represented, too, such
as hexagons, triangles, and so forth.

And speaking of architecture...

## Architecture

The code makes a few (possibly unusualy, possibly insane) architectural
choices, in the name of experimentation and exploration. A simple
module loader is included (see `module.js`), which allows modules to
register themselves, and subsequently be loaded by other modules. As
this duplicates functionality already present in a variety of other
projects, it will probably be replaced eventually.

## Author

Jamis Buck <jamis@jamisbuck.org>

## License

<p xmlns:dct="http://purl.org/dc/terms/" xmlns:vcard="http://www.w3.org/2001/vcard-rdf/3.0#">
  <a rel="license" href="http://creativecommons.org/publicdomain/zero/1.0/">
    <img src="http://i.creativecommons.org/p/zero/1.0/88x31.png" style="border-style: none;" alt="CC0" />
  </a>
  <br />
  To the extent possible under law,
  <a rel="dct:publisher" href="https://github.com/jamis/scruffy-labrador"><span property="dct:title">Jamis Buck</span></a>
  has waived all copyright and related or neighboring rights to
  <span property="dct:title">Scruffy Labrador</span>.
  This work is published from:
  <span property="vcard:Country" datatype="dct:ISO3166" content="US" about="https://github.com/jamis/scruffy-labrador">United States</span>.
</p>
