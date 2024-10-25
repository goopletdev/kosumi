# Kosumi[1.0]: a Go Library
Parses SGF into an array of javascript objects. It's a work in progress as I learn the basics of JavaScript and programming in general. 

Latest update: 
Rethought basically everything. Organized files into directories, separated the goban and text editor into their own respective objects. Still rethinking basic structural things; probably want to separate the navigation panel into its own object. Put eventListeners into their respective objects, and allow passing functions to the objects' respective eventListeners.

## To-do list:
- BIGBUG: allow 'tt' for passes
- BIGBUG: resizing resets line numbers to their indices rather than index+1
- smoler bug: allow for parsing of collections
- navigation: allow for variations
- ascii: allow for boards w/ 2x2 or 3x3 intersections for more detail?
- figure out how to better group sgf utility funcs and object utility funcs
- new AP sgf prop: put it in proper place. also, group root SGF props
- Allow compressing coords when generating SGF
- Syntax highlighting
- Basically rewrite everything in `game-logic.js` so it's not pure spaghetti, and add JSdoc while at it
- Implement Goban class.
    - Class functions:
        - `getNodesAtMove(moveNumber)` => returns array
        - `getNodesByCoord(coordinate)` => returns array
        - `getNodeById(nodeId)` => returns node
        - `getStates()` => sets .state for each node
        - `getVariation(nodeId)` => returns array of moves up to node
        - `makeMainBranch(nodeId)` => self-explanatory
        - `getSiblings(nodeId)` => returns array of sibling nodes
    - can nodes have functions?
        - `node.newCoord(coordinate)` => changes the coordinate in the node
        - `node.insert(node)` => parent becomes grandparent node, inserted node becomes parent
- Implement game logic >.>
- Try and use fewer loops in parse.js! 

## Credits:
the lovely, helpful, experienced, encouraging, friendly folks in the OGS forums for answering my endless questions about SGF and ebb'neffing

Discord friends for answering my similarly endless JavaScript questions, especially  purxiz the Patient 

This project is currently using SVG files from font-awesome.

## Bonus: 
Here are some pictures of my cats Denna and Kvothe

<img src="./READMEimages/denna.jpg" alt="Denna the cat sitting in a box" width=310>
<img src="./READMEimages/kvothe.jpg" alt="Kvothe the cat, existing" width=240>

## Interesting links:
[Unicode shape characters](https://www.w3.org/TR/xml-entity-names/025.html)
[Red-bean.com sgf specification](https://www.red-bean.com/sgf/sgf4.html#1)
[build your own text editor in c](https://viewsourcecode.org/snaptoken/kilo/)
[implementing go in python](https://www.moderndescartes.com/essays/implementing_go/)
[Go assets!](https://github.com/atarnowsky/go-assets)
[jgoboard has neat assets](https://jgoboard.com/)
[Waltheri list of go libraries](https://github.com/waltheri/go-libraries?tab=readme-ov-file)
[other Go file formats](https://senseis.xmp.net/?FileFormat)
[syntax highlighting themes](https://github.com/atelierbram/syntax-highlighting)
[css-tricks.com style scrollbar](https://css-tricks.com/the-current-state-of-styling-scrollbars-in-css/)
[color lovers themes](https://www.colourlovers.com/)
[contrast checker](https://webaim.org/resources/contrastchecker/)
