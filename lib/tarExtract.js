var path = require('path');
var tarStream = require('tar-stream');
var fs = require('fs');

function tarExtract(rootPath) {
	var extract = tarStream.extract();

	extract.on('entry', function(header, stream, cb) {
		if(header.type === 'file') {
			console.log('Extracting ' + header.name);
			var out = fs.createWriteStream(moveToRootPath(header.name, rootPath));
			stream.pipe(out);
			stream.on('end', function() {
				cb();
			});
		} else if(header.type === 'directory') {
			fs.mkdir(moveToRootPath(header.name, rootPath), function() {
				cb();
			})
		} else {
			cb();
		}
	});

	return extract;
}

function moveToRootPath(entryPath, rootPath) {
	var targetPath = entryPath.split('/');
	targetPath.shift();
	targetPath.unshift(rootPath);
	targetPath = path.join.apply(path, targetPath);
	return targetPath;
}

module.exports = exports = tarExtract;
