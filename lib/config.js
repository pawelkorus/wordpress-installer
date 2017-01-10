function config(config) {
	return {
		version: function() { return config.version || 'latest'; },
		versionUrl: function() { return versionUrl(this.version()); },
		rootPath: function() { return rootPath(config.root); },

		dbName: function() { return config.dbName; },
		dbHost: function() { return config.dbHost || 'localhost'; },
		dbUser: function() { return config.dbUser; },
		dbPassword: function() { return config.dbPassword; },

		tablePrefix: function() { return config.tablePrefix || 'wp_'; }
	}
}

function versionUrl(version) {
	var version = version || 'latest';
	var url = 'https://wordpress.org/';
	return url + 'wordpress-' + version + '.tar.gz';
}

function rootPath(rootPath) {
	return rootPath? rootPath : 'wordpress';
}

module.exports = exports = config;
