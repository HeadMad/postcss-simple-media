# Make Your Media Simple

[PostCSS] plugin postcss-simple-media.

[PostCSS]: https://github.com/postcss/postcss

All styles properties declared after the media property<br>
to the end of the rule or to the next media property,<br>
will be placed in the media query with the specified parameters

## Install
```
npm install --save-dev postcss-simple-media
```
or
```
npm -D HeadMad/postcss-simple-media
```

## Exemple
```css
/*** Before ***/
.box {
  width: 20%;

  media: 960-;
  width: 25%;

  media: 560-800;
  width: 50%;

  media: 380+;
  width: 100%;
}
```
```css
/*** After ***/
.box {
  width: 20%;
}

@media (max-width: 960px) {
  .box {
    width: 25%;
  }
}

@media (min-width: 560px) and (max-width: 800px) {
  .box {
    width: 50%;
  }
}

@media (min-width: 380px) {
  .box {
    width: 100%;
  }
}

```

## Some rules
For value of media-property you can use standart syntax CSS media-query params, or shortcodes with next rules:
- Space between the parameters will be replaced with a keyword `and`
- Exclamation mark (!) will be replaced with a keyword `not`
- Range of widths must be without spaces: `560-1200` not `560 - 1200`

## More Exemples
| media:                   | @media                                    |
|:-------------------------|:------------------------------------------|
| 1200                     | (width: 1200px)                           |
| 1600-                    | (max-width: 1600px)                       |
| 860+                     | (min-width: 860px)                        |
| 380-960                  | (min-width: 380px) and (min-width: 960px) |
| 960-380                  | (min-width: 380px) and (min-width: 960px) |
| all 960-                 | all and (max-width: 960px)                |
| (orientation: landscape) | (orientation: landscape)                  |
| only screen, !print      | only screen, not print                    |

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```javascript
const simpleMedia = require('postcss-simple-media')

module.exports = {
  plugins: [
    simpleMedia
  ]
}
```
If you whant use another word of property, not `media:`
<br>Just pass in plugin argument object width field `prop`,
<br>and value that you whant. Value can be `String` or `Regular Expression`

```javascript
const simpleMedia = require('postcss-simple-media')

module.exports = {
  plugins: [
    simpleMedia({prop: 'simple-media'})
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage

## License
MIT
