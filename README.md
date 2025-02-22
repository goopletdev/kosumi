# Kosumi[0.1.0]: a Go Library
Text-based SGF editor. It's a work in progress as I learn the basics of JavaScript and programming in general. 

## Features:
- Display the boardstate on a graphical goban
- Interactable canvas element
- Correct SGF style errors in SGF files from OGS, and maximize compatibility by unzipping compressed coordinates

# modern to-do list:
- tree editing Features: 
    - Insert mode (i before, a after)
    - v - new child variation; s - new sibling variation
    - retractively update stone locations

## To-do list:
- reimplement: syntax highlighting
- reimplement: 'Autocomplete for `[`,`]`,`(`,`)`,`;` inputs'
- highlighting multiple nodes: number them on display!!! yooo - note from fren
- improve error handling for SGF parsing; explain common errors better
- map arrow keys to navigation panel buttons?
- improve syntax highlighting (typing for propIdent/val pairs)
- navigation: allow for variations
- Allow compressing coords when generating SGF
- implement DT.value.get() function properly in sgfProperties

## Known issues:
- BIGBUG: allow 'tt' for passes
- smoler bug: allow for parsing of collections

## Credits:
the lovely, helpful, experienced, encouraging, friendly folks in the OGS forums for answering my endless questions about SGF and ebb'neffing

Discord friends for answering my similarly endless JavaScript questions, especially  purxiz the Patient 

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
