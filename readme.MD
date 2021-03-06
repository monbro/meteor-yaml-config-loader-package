meteor-yaml-config-loader-package
=================================

This is a package for the awesome full stack framework [meteorjs](https://www.meteor.com/).

The package provides an easy way to integrate your configurations for client / server by using YAML files. For exmaple you can have a file /private/config/server.yml and /private/config/client.yml. The client.yml will be exposed to the client side automatically.

Compared to the settings.json file, this configuration / settings would be loaded and available alway. Think of the official file settings.json more of a storage for environment related settings.

### Dependencies

* Meteor >1.0
* udondan:yml >3.2.2_1

### Installation in your meteor app

Use `meteor add monbro:yaml-config-loader` to add the package to your meteor app

### Or installation in your own meteor package

Simply add the following to your package.js file

``` js
Package.onUse(function(api) {
  api.use('monbro:yaml-config-loader', 'server');
});

```

### Usage

The package will expose a the full config on the server side `YamlConfig` which you can use as showed in the following example. On the client side it will automatically publish only the config `YamlClientConfig` which is stored in the client.yml file. You need to do the following three stepts to make it work.

### A) Create both config files

``` yml
# in your meteor app: /private/config/server.yml
redis_db:
    url: http://localhost:1234

newsletter:
  sender: example@mail.com
```

``` yml
# in your meteor app: /private/config/client.yml
# likely we only store here default variables etc. no sensetive data

fruits:
    - apple
    - banana
    - kiwi
    - avocado
```

### B) Load the Config files into your main app

``` js
if (Meteor.isServer) {
  // load the configs from our app
  // as a packae has no access ot the assets of the main app (files in the private folder), we need to pass the `Assets` object
  YamlConfig.loadFiles(Assets);
}
```

### C) Use the configs somewhere in your app

``` js
// keep in mind, that you need to have called the config files loader from step B) before using the following code
if (Meteor.isServer) {
  // from the example yaml file
  var config = YamlConfig.getServerConfig();
  var redisDbUrl = config.redis_db.url; // should return http://localhost:1234
}
```

``` js
if (Meteor.isClient) {
  Meteor.call('getClientConfig', function (err, result) {
      if(err) {
          console.log(error);
      } else {
          // from the example yaml file
          var myFirstFruit = result.fruits[0]; // should return apple
          console.log(myFirstFruit);
      }
  });
}
```

### Define custom YAML files to be loaded

If you want, you can specify which YAML files should be used and exposed to the client or server side.

``` js
if (Meteor.isServer) {

  // this is an example of how to specific yaml files to be loaded, you need to set the package settings before loading the yaml files
  YamlConfig.setPackageSettings({
      server: [
          'config/server/default_settings.yml',
          'config/server/apikeys.yml',

      ],
      client: [
          'config/client/main.yml',
          'config/client/routes.yml',
          'config/client/theme_options.yml',
      ],
      // useKeysInObject: true // if you want to have the file names as keys in your object, set this parameter
  });

  // now you can load the files
  YamlConfig.loadFiles(Assets);
}
```