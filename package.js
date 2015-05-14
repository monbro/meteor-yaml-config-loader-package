Package.describe({
  name: 'monbro:yaml-config-loader',
  summary: 'Easy way of integrating your configuration or settings for client / server by using YAML files.',
  version: '0.2.0',
  git: 'https://github.com/monbro/meteor-yaml-config-loader-package/'
});

function configurePackage(api) {
  api.versionsFrom('1.0');
  api.use('udondan:yml@3.2.2_1', 'server');
  api.addFiles('server.js', 'server');
  api.export('YamlConfig', 'server');
}

Package.onUse(function(api) {
  configurePackage(api);
});

Package.onTest(function(api) {
  configurePackage(api);

  api.use('tinytest');
  // api.addFiles('tests/breadcrumb-tests.js');
});
