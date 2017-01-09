var fs = require('fs');
var zlib = require('zlib');
var request = require('request');
var tarStream = require('tar-stream');

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
	console.log('Installing wordpress');
	request('https://wordpress.org/wordpress-4.7.tar.gz').pipe(zlib.createGunzip()).pipe(extract);
}

module.exports = exports = installer;
