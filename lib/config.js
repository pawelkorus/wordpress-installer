function config(config) {
	return {
		version: function() { return config.version || 'latest'; },
		versionUrl: function() { return versionUrl(this.version()); },
		rootPath: function() { return rootPath(config.root); }
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
