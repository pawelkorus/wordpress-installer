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
	fs.stat(config.rootPath(), function(err, stat) {
		if(err) {
			install(config);
		}
	});
}

function install(config) {
	var targetPath = config.rootPath();
	var url = config.versionUrl();
	console.log('Installing wordpress from ' + url + ' to ' + targetPath);

	fs.stat(targetPath, function(err, stats) {
		if(err) {
			fs.mkdir(targetPath);

			request(url).pipe(zlib.createGunzip()).pipe(tarExtract(targetPath));
		} else {
			console.error("Installing wordpress failed: target directory already exists");
		}
	})
}

module.exports = exports = installer;
