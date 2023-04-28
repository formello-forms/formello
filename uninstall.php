<?php

$formello_option = get_option( 'formello', false );

if ( $formello_option ) {
	delete_option( 'formello_installed' );
}
