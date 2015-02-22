// our configuration object
YamlConfig = (function () {
    var clientConfig = null,
        serverConfig = null;

    function publicGetServerConfig() {
        return serverConfig;
    }

    function publicGetClientConfig() {
        return clientConfig;
    }

    function privateSetServerConfig(s) {
      var data;
      try {
        data = YAML.safeLoad(s);
      } catch (e) {
        console.log(e);
        throw new Meteor.Error( "The file /private/config/server.yml contains no valid YAML!" );
      }
      serverConfig = data;
    }

    function privateSetClientConfig(s) {
      var data;
      try {
        data = YAML.safeLoad(s);
      } catch (e) {
        console.log(e);
        throw new Meteor.Error( "The file /private/config/client.yml contains no valid YAML!" );
      }
      clientConfig = data;
    }

    function publicLoadFiles(AssetsApp) {
      // prevent loading config later from somewhere else or to manipulate it
      if(clientConfig || serverConfig) {
        throw new Meteor.Error( "Config has been set already!" );
      }

      // load the server side config
      var res = AssetsApp.getText("config/server.yml");
      if(!res) {
        console.log("Could not find file /private/config/server.yml in your meteor app!");
      } else {
        privateSetServerConfig(res);
      }

      // load all public client side config
      var res = AssetsApp.getText("config/client.yml");
      if(!res) {
        console.log("Could not find file /private/config/client.yml in your meteor app!");
      } else {
        privateSetClientConfig(res);
      }
    }

    return {
        getClientConfig: publicGetClientConfig,
        getServerConfig: publicGetServerConfig,
        loadFiles: publicLoadFiles
    };

})();

// expose client config to the client side
Meteor.methods({
  getClientConfig: function () {
    return YamlConfig.getClientConfig();
  }
});