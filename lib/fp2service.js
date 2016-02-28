"use strict";

function fp2service( fingerprint ) {
	return 'es-' + fingerprint.replace( /\:/g, '' ).substr( 0, 7 );
}

module.exports = fp2service;
