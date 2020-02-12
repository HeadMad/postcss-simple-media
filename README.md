# Make Your Media Simple

[PostCSS] plugin postcss-simple-media.

[PostCSS]: https://github.com/postcss/postcss
## About
All styles properties declared after the media property
to the end of the rule or to the next media property,
will be placed in the media query with the specified parameters

```css

.row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: auto;

  media: 1200+;
  width: 80%;
  
  media: 960-;
  width: 100%;
  height: 100%;
}

.col {
  width: 10%;

  media: 960-, (orientation: landscape);
  width: 20%;

  media: only screen 480-640;
  width: 25%;

  media: !handheld
  font-size: 1.5
}

```

```css
.row {
  display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
  margin: auto;
}

.col {
  width: 10%;
}

@media (min-width: 1200px) {
  .row {
    width: 80%;
  }
}

@media (max-width: 960px) {
  .row {
    width: 100%;
    height: 100%;
  }
}

@media (max-width: 960px), (orientation: landscape) {
  .col {
    width: 20%;
  }
}

@media only screen and (min-width: 480px) and (max-width: 640px) {
  .col {
    width: 25%;
  }
}

@media not handheld {
  .col {
    font-size: 1.5;
  }
}
```

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('PLUGIN_NAME'),
    require('autoprefixer')
  ]
}
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage
