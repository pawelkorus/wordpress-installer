var fs = require('fs');
var zlib = require('zlib');
var request = require('request');
var tarStream = require('tar-stream');
var path = require('path');

function installer(config) {
	config = config || {};

	return {
		ensure: function() { return ensure(config); }
		,install: function() { return install(config); }
		,remove: function() { return remove(config); }
	}
}

function ensure(config) {
	fs.stat(wordpressRootPath(config), function(err, stat) {
		if(err) {
			install(config);
		}
	});
}

function install(config) {
	var targetPath = wordpressRootPath(config);
	var url = wordpressVersionUrl(config);
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

function wordpressVersionUrl(config) {
	var version = config.version || 'latest';
	var url = 'https://wordpress.org/';

	return url + 'wordpress-' + version + '.tar.gz';
}

function wordpressRootPath(config) {
	return config.wordpressRoot? config.wordpressRoot : 'wordpress';
}

function tarExtract(rootPath) {
	var extract = tarStream.extract();

	extract.on('entry', function(header, stream, cb) {
		if(header.type === 'file') {
			console.log('Extracting ' + header.name);

			var targetPath = header.name.split('/');
			targetPath.shift();
			targetPath.unshift(rootPath);
			targetPath = path.join.apply(path, targetPath);

			var out = fs.createWriteStream(targetPath);
			stream.pipe(out);
			stream.on('end', function() {
				cb();
			});
		} else if(header.type === 'directory') {
			var targetPath = header.name.split('/');
			targetPath.shift();
			targetPath.unshift(rootPath);
			targetPath = path.join.apply(path, targetPath);

			fs.mkdir(targetPath, function() {
				cb();
			})
		} else {
			cb();
		}
	});

	return extract;
}

module.exports = exports = installer;
