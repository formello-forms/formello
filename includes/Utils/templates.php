<?php
/**
 * Function for managing templates
 *
 * @package Formello\Utils
 */

namespace Formello\Utils;

defined( 'ABSPATH' ) || exit;

/**
 * Add Formello templates to patterns
 *
 * @param array  $response The array of patterns.
 * @param object $server The server.
 * @param object $request The request.
 * @return array
 */
function get_templates( $response, $server, $request ) {
	if ( '/wp/v2/block-patterns/patterns' !== $request->get_route() ) {
		return $response;
	}

	$args = array(
		'post_type'     => 'formello_form',
		'fields'        => '',
		'no_found_rows' => true,
		'post_status'   => 'publish',
		'numberposts'   => -1,
	);

	$all_patterns = get_posts( $args );

	$local_patterns = array();

	foreach ( $all_patterns as $pattern ) {
		$local_patterns[] = array(
			'title' => $pattern->post_title,
			'content' => '<!-- wp:formello/library {"ref":' . $pattern->ID . '} /-->',
			'description' => '',
			'blockTypes' => array(
				'formello/library',
			),
			'keywords' => array(),
			'categories' => array( 'formello' ),
			'name' => 'formello/' . sanitize_title( $pattern->post_title ),
		);
	}
	return array_merge( $response, $local_patterns );
}

add_filter( 'rest_pre_echo_response', __NAMESPACE__ . '\get_templates', 10, 3 );
