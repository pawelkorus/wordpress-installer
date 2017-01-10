var endOfLine = '\n'

function writer(outStream) {
	return {
		startTag: startTag.bind(null, outStream)
		,endTag: endTag.bind(null, outStream)
		,define: define.bind(null, outStream)
		,variable: variable.bind(null, outStream)
		,writeLine: writeLine.bind(null, outStream)
	}
}

function startTag(outStream) {
	outStream.write('<?php' + endOfLine);
}

function endTag(outStream) {
	outStream.write('?>' + endOfLine);
}

function define(outStream, key, value) {
	outStream.write('define(\''+ key + '\',\'' + value + '\');' + endOfLine);
}

function writeLine(outStream, v) {
	outStream.write(v + endOfLine);
}

function variable(outStream, v, val) {
	outStream.write('$' + v + ' = ' + val + ';\n');
}

module.exports = exports = writer;
