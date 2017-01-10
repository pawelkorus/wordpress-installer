var installer = require('./lib/installer.js');
installer({
	root: 'wordpress-latest',
	version: 'latest'
}).ensure();
