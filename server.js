// our configuration object
YamlConfig = (function () {
    var clientConfig = null,
        serverConfig = null,
        parentAssets,
        packageSettings;

    function publicGetServerConfig() {
        return serverConfig;
    }

    function publicGetClientConfig() {
        return clientConfig;
    }

    function publicSetPackageSettings(settings) {
      packageSettings = settings;
    }

    function privateStringToObject(s, path) {
      try {
        return YAML.safeLoad(s);
      } catch (e) {
        // console.log(e);
        throw new Meteor.Error( 'The given string of the file '+path+' contains no valid YAML!' );
      }
    }

    function publicLoadFiles(assetsApp) {
      parentAssets = assetsApp;

      // set default settings if there are none
      if(!packageSettings) {
        packageSettings = {
          client: [
            'config/client.yml'
          ],
          server: [
            'config/server.yml'
          ]
        }
      }

      // prevent loading config later from somewhere else or to manipulate it
      if(clientConfig || serverConfig) {
        throw new Meteor.Error( "YamlConfig has been set already!" );
      } else {
        clientConfig = serverConfig = {};
      }

      // read out the client settings
      _.each(packageSettings.client, function(val, key) {
        var s = readConfigFile(val);
        if(s !== false) {
          var obj = privateStringToObject(s, key);
          _.extend(clientConfig, obj);
        }
      });

      // read out the server settings
      _.each(packageSettings.server, function(val, key) {
        var s = readConfigFile(val);
        if(s !== false) {
          var obj = privateStringToObject(s, key);
          _.extend(serverConfig, obj);
        }
      });
    }

    function readConfigFile(path) {
      // load the server side config
      var errorMsg = 'Could not find file /private/'+path+' in your meteor app!';
      try {
        var res = parentAssets.getText(path);
        if(!res) {
          console.log(errorMsg);
          throw new Meteor.Error( 'The file '+path+' does not exist!' );
        } else {
          return res;
        }
      } catch(error) {
        console.log(errorMsg);
        console.log(error);
      }
    }

    return {
        getClientConfig: publicGetClientConfig,
        getServerConfig: publicGetServerConfig,
        setPackageSettings: publicSetPackageSettings,
        loadFiles: publicLoadFiles
    };

})();

// expose client config to the client side
Meteor.methods({
  getClientConfig: function () {
    return YamlConfig.getClientConfig();
  }
});