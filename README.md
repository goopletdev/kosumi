# Kosumi[0.1.0]: a Go Library
Text-based SGF editor. It's a work in progress as I learn the basics of JavaScript and programming in general. 

## Features:
- Syntax highlighting
- Display the boardstate on a graphical goban
- Correct SGF style errors in SGF files from OGS, and maximize compatibility by unzipping compressed coordinates

## To-do list:
- display actively edited node as active node on the goban
- unit testing
- jsdoc
- move navigation event listeners to static function, have them listen to external game object
- map arrow keys to navigation panel buttons?
- make line-highlighting instantaneous upon click/arrow
- improve syntax highlighting (typing for propIdent/val pairs)
- flesh out nodeInfo class
- navigation: allow for variations
- figure out how to better group sgf utility funcs and object utility funcs
- Allow compressing coords when generating SGF
- Basically rewrite everything in `game-logic.js` so it's not pure spaghetti, and add JSdoc while at it
- Try and use fewer loops in parse.js! 

## Known issues:
- resizing using the middle dividing bar is slow
- BIGBUG: canvas gets progressively smaller with different shaped boards, until refresh
- smolbug: fix toggle display style button
- BIGBUG: allow 'tt' for passes
- smoler bug: allow for parsing of collections

## Learning goals:
- actually understand how to use jsdoc
- figure out unit testing

## Credits:
the lovely, helpful, experienced, encouraging, friendly folks in the OGS forums for answering my endless questions about SGF and ebb'neffing

Discord friends for answering my similarly endless JavaScript questions, especially  purxiz the Patient 

This project is currently using SVG files from font-awesome.

## Bonus: 
Here are some pictures of my cats Denna and Kvothe

<img src="./READMEimages/denna.jpg" alt="Denna the cat sitting in a box" width=310>
<img src="./READMEimages/kvothe.jpg" alt="Kvothe the cat, existing" width=240>

## Interesting links:
- [Unicode shape characters](https://www.w3.org/TR/xml-entity-names/025.html)
- [Red-bean.com sgf specification](https://www.red-bean.com/sgf/sgf4.html#1)
- [build your own text editor in c](https://viewsourcecode.org/snaptoken/kilo/)
- [implementing go in python](https://www.moderndescartes.com/essays/implementing_go/)
- [Go assets!](https://github.com/atarnowsky/go-assets)
- [jgoboard has neat assets](https://jgoboard.com/)
- [Waltheri list of go libraries](https://github.com/waltheri/go-libraries?tab=readme-ov-file)
- [other Go file formats](https://senseis.xmp.net/?FileFormat)
- [syntax highlighting themes](https://github.com/atelierbram/syntax-highlighting)
- [css-tricks.com style scrollbar](https://css-tricks.com/the-current-state-of-styling-scrollbars-in-css/)
- [color lovers themes](https://www.colourlovers.com/)
- [contrast checker](https://webaim.org/resources/contrastchecker/)
- [GTP (Go Text Protocol) specification](https://www.lysator.liu.se/~gunnar/gtp/gtp2-spec-draft2/gtp2-spec.html)
