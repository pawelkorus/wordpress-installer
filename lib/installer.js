var fs = require('fs');
var zlib = require('zlib');
var request = require('request');
var installerConfig = require('./config');
var tarExtract = require('./tarExtract');
var path = require('path');
var phpWriter = require('./php/phpWriter');

function installer(config) {
	config = installerConfig(config);

	return {
		ensure: function() { return ensure(config); }
		,install: function() { return install(config); }
		,remove: function() { return remove(config); }
		,createWpConfig: function() { return createWpConfig(config); }
	}
}

function ensure(config) {
	fs.mkdir(config.rootPath(), function(err) {
		if(!err) {
			install(config);
			createWpConfig(config);
		}
	});
}

function install(config) {
	var targetPath = config.rootPath();
	var url = config.versionUrl();
	console.log('Installing wordpress from ' + url + ' to ' + targetPath);
	request(url).pipe(zlib.createGunzip()).pipe(tarExtract(targetPath));
}

function createWpConfig(config) {
	var wpConfigFilePath = path.join(config.rootPath(), 'wp-config.php');
	var wpConfigStream = fs.createWriteStream(wpConfigFilePath);
	var php = phpWriter(wpConfigStream);

	php.startTag();
	php.define('DB_NAME', config.dbName());
	php.define('DB_USER', config.dbUser());
	php.define('DB_PASSWORD', config.dbPassword());
	php.define('DB_HOST', config.dbHost());
	php.define('DB_CHARSET', 'utf8');
	php.define('DB_COLLATE', '');
	php.define('AUTH_KEY', '~{C~%f5e?.:kdkqDYcDrn -$7zw^h72}V:1);%NwQH[f2BJ;J#^}xD0.[@`+=3M_');
	php.define('SECURE_AUTH_KEY',  'g-}>|bHmd>QuW9&W?4/|I%N-a{)(8on57qH%<2%(ganXNG-N%Ps/[|@dbT!3?%7$');
	php.define('LOGGED_IN_KEY',    '#h]4$&cJy4~fF;XU@>9}J9~ma/9*2MOF|mY+IDnUwv !BdQ6iwO%w,5^|=v=+#:|');
	php.define('NONCE_KEY',        '!S#1`FSHeHdoM8-,u|6_|@DZk0jiX!9+BEqFGj2NQ!@Q-r&Yo@~U!c/)|p;czEu&');
	php.define('AUTH_SALT',        '1:ZQJvM*wzfa#3=)-*1-KSNp;}:JJ;u{ql+yFC};2dbUv|7XD|4|SFKP_=Ng`;!@');
	php.define('SECURE_AUTH_SALT', '>5|Pt@M91+!-V+aW{%r2/En>@edrfa-y_z_fM)1H#TVlp|W;3,g|dzXPq@1<x*%W');
	php.define('LOGGED_IN_SALT',   '`:M]MR+h=5^>-1 D=L8#48p1|l{7d9G(~ut<43WyGdC&{qrkD`fC$tC_AQX`kED|');
	php.define('NONCE_SALT',       'c39X>x1V4F-CU,j+,?*9@F|lw2#kUTqqx<4X*WqaeE2#+`[o]Q7+):dfHt#&`/bU');

	php.variable('table_prefix', '\''+config.tablePrefix()+'\'');

	php.define('WP_DEBUG', false);

	php.writeLine('if ( !defined(\'ABSPATH\'))');
	php.writeLine('\tdefine(\'ABSPATH\', dirname(__FILE__) . \'/\');');
	php.writeLine('require_once(ABSPATH . \'wp-settings.php\');');

	wpConfigStream.end();
}

function phpWriteDefineStatement(outStream, defineKey, defineValue) {

}

module.exports = exports = installer;
