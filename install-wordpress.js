var installer = require('./lib/installer.js');
installer({
	wordpressRoot: 'wordpress-latest',
	version: 'latest'
}).ensure();
