const path = require('path')

const { injectBabelPlugin, getLoader } = require('react-app-rewired')
const rewireEslint = require('react-app-rewire-eslint')

const fileLoaderMatcher = function (rule) {
  return rule.loader && rule.loader.indexOf(`file-loader`) != -1
}

module.exports = function override(config, env) {
  // alias
  config.resolve = {
    alias: {
      common: path.resolve(__dirname, 'src/common/'),
      util: path.resolve(__dirname, 'src/util/'),
      config: path.resolve(__dirname, 'src/config/'),
      model: path.resolve(__dirname, 'src/model/'),
      asset: path.resolve(__dirname, 'src/asset/'),
      layout: path.resolve(__dirname, 'src/layout/'),
      less: path.resolve(__dirname, 'src/less/'),
      component: path.resolve(__dirname, 'src/component/'),
      container: path.resolve(__dirname, 'src/container/'),
      context: path.resolve(__dirname, 'src/context/')
    }
  } 

  // babel-plugin-import
  config = injectBabelPlugin(['import', [{
    libraryName: 'antd',
    //style: 'css',
    style: true, // use less for customized theme
  }, {
    libraryName: 'antd-mobile',
    //style: 'css',
    style: true, // use less for customized theme
  }]], config)

  // 装饰器语法题
  config = injectBabelPlugin('transform-decorators-legacy', config)

  // customize theme
  config.module.rules[1].oneOf.unshift(
    {
      test: /\.less$/,
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'src/less')
      ],
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[local]___[hash:base64:5]'
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9', // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009',
              }),
            ],
          },
        },
        {
          loader: require.resolve('less-loader'),
          options: {
            // theme vars, also can use theme.js instead of this.
            // modifyVars: { '@brand-primary': '#1DA57A' },
            javascriptEnabled: true
          },
        },
      ]
    }
  )

  // for antd-mobile less
  config.module.rules[1].oneOf.unshift(
    {
      test: /\.less$/,
      include: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'src/less')
      ],
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader')
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9', // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009',
              }),
            ],
          },
        },
        {
          loader: require.resolve('less-loader'),
          options: {
            // theme vars, also can use theme.js instead of this.
            modifyVars: {
              '@primary-color': '#293677',
              '@brand-primary': '#293677',
              '@switch-fill': '#6082FF',
              '@brand-important': '#FF4E60',
              '@radius-md': '4px',
              '@border-radius-base': '5px'
            },
            javascriptEnabled: true
          },
        },
      ]
    }
  )

  // css-modules
  config.module.rules[1].oneOf.unshift(
    {
      test: /\.css$/,
      exclude: /node_modules|antd-mobile\.css|antd\.css/,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            modules: true,
            importLoaders: 1,
            localIdentName: '[local]___[hash:base64:5]'
          },
        },
        {
          loader: require.resolve('postcss-loader'),
          options: {
            // Necessary for external CSS imports to work
            // https://github.com/facebookincubator/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              autoprefixer({
                browsers: [
                  '>1%',
                  'last 4 versions',
                  'Firefox ESR',
                  'not ie < 9', // React doesn't support IE8 anyway
                ],
                flexbox: 'no-2009',
              }),
            ],
          },
        },
      ]
    }
  )

  // file-loader exclude
  let l = getLoader(config.module.rules, fileLoaderMatcher)
  l.exclude.push(/\.less$/)

  // eslint
  config = rewireEslint(config, env)

  return config
}
