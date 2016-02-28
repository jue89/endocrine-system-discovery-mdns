"use strict";

const mdns = require( 'mdns' );
const fp2service = require( './fp2service.js' );

function advertisement( fingerprint, port ) {

	let service = mdns.tcp( fp2service( fingerprint ) );

	// Start advertising port and fingerprint
	let advertiser = mdns.createAdvertisement( service, port );
	advertiser.start();

	// Return the stop method
	return advertiser.stop;

}

module.exports = advertisement;
