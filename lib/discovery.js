"use strict";

const mdns = require( 'mdns' );
const fp2service = require( './fp2service.js' );

function discovery( timeout ) {

	// Make sure timeout is a number
	if( typeof timeout != 'number' ) timeout = null;

	// Factory for the mDNS discovery method
	return function( fingerprint ) {

		// The first 7 chars are enough to find our broker
		let service = fp2service( fingerprint );

		// Start browsing for our broker
		let browser = mdns.createBrowser( mdns.tcp( service ) );

		return new Promise( ( resolve, reject ) => {

			// Set a timeout for discovery if user specified one
			let timeoutHandle = null;
			if( timeout ) timeoutHandle = setTimeout( () => {

				// Stop browser
				browser.removeAllListeners();
				browser.stop();

				// Reject since we haven't obtained an anwser within specified time
				reject();

			}, timeout * 1000 );

			// Setup event listener
			browser.once( 'serviceUp', ( server ) => {

				// If we found a service, stop searching, timeout and resovle
				browser.stop();

				if( timeoutHandle ) clearTimeout( timeoutHandle );

				// Create mqtts URL
				resolve( 'mqtts://' + server.host + ':' + server.port.toString() );

			} );

			browser.start();

		} );

	}

}

module.exports = discovery;
