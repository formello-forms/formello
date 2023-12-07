<?php

namespace Formello\Utils;

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
			'content' => $pattern->post_content,
			'description' => '',
			'blockTypes' => array(
				'formello/library',
			),
			'keywords' => array(),
			'categories' => array( 'form' ),
			'name' => 'formello/' . sanitize_title( $pattern->post_title ),
		);
	}
	return array_merge( $response, $local_patterns );
}

add_filter( 'rest_pre_echo_response', __NAMESPACE__ . '\get_templates', 10, 3 );
