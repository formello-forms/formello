<?php
/**
 * Set our block attribute defaults.
 *
 * @package Formello
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Get defaults for our general options.
 *
 * @since 0.1
 */
function formello_get_option_defaults() {
	return apply_filters(
		'formello_option_defaults',
		array(
			'validation_messages' => [
				'missingValue' => [
					'default' 			=> 'Please fill out this field.',
					'checkbox' 			=> 'This field is required.',
					'radio' 			=> 'Please select a value.',
					'select' 			=> 'Please select a value.',
					'select-multiple'	=> 'Please select at least one value.',
				],
				'patternMismatch' => [
					'email' 			=> 'Please enter a valid email address.',
					'url' 				=> 'Please enter a URL.',
					'number' 			=> 'Please enter a number',
					'color' 			=> 'Please match the following format: #rrggbb',
					'date' 				=> 'Please use the YYYY-MM-DD format',
					'time' 				=> 'Please use the 24-hour time format. Ex. 23:00',
					'month' 			=> 'Please use the YYYY-MM format',
					'default' 			=> 'Please match the requested format.'
				],
				'outOfRange' 	=> [
					'over' 				=> 'Please select a value that is no more than {max}.',
					'under' 			=> 'Please select a value that is no less than {min}.'
				],
				'wrongLength' 	=> [
					'over' 				=> 'Please shorten this text to no more than {maxLength} characters. You are currently using {length} characters.',
					'under' 			=> 'Please lengthen this text to {minLength} characters or more. You are currently using {length} characters.'
				]
			],
			'integrations' => [
				'mailchimp' => [ 'key' => '' ]
			],
	        'recaptcha' => [
	            'version' => 3,
	            'site_key' => '',
	            'secret_key' => '',
	            'threshold' => 0.4
	        ]
		)
	);
}

