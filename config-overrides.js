const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    'querystring': require.resolve('querystring-es3')
  })
);