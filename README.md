# Make Your Media Simple

[PostCSS] plugin postcss-simple-media.

[PostCSS]: https://github.com/postcss/postcss

```css
@sm 960- {
  .foo {
    height: 100%;
  }
}

.bar {
  height: 64px;
  @sm 960+ {
    width: 100%;
    height: 48px;
  }
}

.baz {
  height: 32px;
  @sm 540-960 {
    color: #ccc;
    font-size: 1.4em;
  }
}
```

```css
.bar {
  height: 64px;
}

.baz {
  height: 32px;
}

@media (min-width: 960px) {
  .bar {
    width: 100%;
    height: 48px;
  }
}

@media (max-width: 960px) {
  .foo {
    height: 100%;
  }
}

@media (min-width: 540) and (max-width: 960px) {
  .baz {
    color: #ccc;
    font-size: 1.4em;
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
