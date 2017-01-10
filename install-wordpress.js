var installer = require('./lib/installer.js');
installer({
	root: 'wordpress-latest',
	version: 'latest',
	dbName: 'dbName',
	dbUser: 'dbUser',
	dbPassword: 'dbPassword',
	dbHost: 'localhost',
	tablePrefix: 'tablePrefix'
}).createWpConfig();
