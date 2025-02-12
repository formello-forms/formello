<?php
/**
 * Uninstall hook
 *
 * @package formello
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

$formello_option = get_option( 'formello', false );

if ( $formello_option ) {
	delete_option( 'formello_version' );
	delete_option( 'formello_installed' );
	if ( $formello_option['optionDelete'] ) {
		delete_option( 'formello' );
	}
}
