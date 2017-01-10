var fs = require('fs');
var zlib = require('zlib');
var request = require('request');
var installerConfig = require('./config');
var tarExtract = require('./tarExtract');

function installer(config) {
	config = installerConfig(config);

	return {
		ensure: function() { return ensure(config); }
		,install: function() { return install(config); }
		,remove: function() { return remove(config); }
	}
}

function ensure(config) {
	fs.mkdir(config.rootPath(), function(err) {
		if(!err) {
			install(config);
		}
	});
}

function install(config) {
	var targetPath = config.rootPath();
	var url = config.versionUrl();
	console.log('Installing wordpress from ' + url + ' to ' + targetPath);
	request(url).pipe(zlib.createGunzip()).pipe(tarExtract(targetPath));
}

module.exports = exports = installer;
