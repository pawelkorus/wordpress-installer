var fs = require('fs');
var zlib = require('zlib');
var request = require('request');
var tarStream = require('tar-stream');
var path = require('path');

var extract = tarStream.extract();
extract.on('entry', function(header, stream, cb) {
	if(header.type === 'file') {
		console.log('Extracting ' + header.name);
		var out = fs.createWriteStream(header.name);
		stream.pipe(out);
		stream.on('end', function() {
			cb();
		});
	} else if(header.type === 'directory') {
		fs.mkdir(header.name, function() {
			cb();
		})
	} else {
		cb();
	}
})

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
	console.log('Installing wordpress to ' + wordpressRootPath(config));

	fs.stat(wordpressRootPath(config), function(err, stats) {
		if(err) {
			request('https://wordpress.org/wordpress-4.7.tar.gz').pipe(zlib.createGunzip()).pipe(extract);
		} else {
			console.error("Installing wordpress failed: target directory already exists");
		}
	})

}

function wordpressRootPath(config) {
	return config.wordpressRoot? config.wordpressRoot : 'wordpress';
}

module.exports = exports = installer;
