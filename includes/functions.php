<?php
/**
 * Functions available globally
 *
 * @package Formello
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

//add_action( 'wp_head', 'formello_get_frontend_block_css' );

/**
 * Get defaults for our general otions.
 *
 * @since 1.0.0
 */
function formello_get_frontend_block_css() {
	if ( ! function_exists( 'has_blocks' ) ) {
		return;
	}

	$content = formello_get_parsed_content();

	if ( ! $content ) {
		return;
	}

	$data = formello_get_block_data( $content );

	if ( ! $data ) {
		return;
	}

	$css = '';

	$css .= formello_get_parsed_css( $data );		

	if ( empty( $css ) ) {
		return;
	}

	printf(
		'<style id="formello-css">%s</style>',
		wp_strip_all_tags( $css ) // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	);

}

/**
 * Parse our content for blocks.
 *
 * @param string $content Optional content to parse.
 * @since 1.1
 */
function formello_get_parsed_content( $content = '' ) {
	if ( ! function_exists( 'has_blocks' ) ) {
		return;
	}

	if ( ! $content && has_blocks( get_the_ID() ) ) {
		global $post;
		if ( ! is_object( $post ) ) {
			return;
		}

		$content = $post->post_content;
	}

	if ( ! function_exists( 'parse_blocks' ) ) {
		return;
	}

	$content = parse_blocks( $content );

	return $content;
}

/**
 * Retrive attributes from our blocks.
 *
 * @since 0.1
 * @param array $content The content of our page.
 * @param array $data Data used to loop through the function as needed.
 * @param int   $depth Keep track of how deep we are in nested blocks.
 *
 * @return array
 */
function formello_get_block_data( $content, $data = array(), $depth = 0 ) {
	if ( ! is_array( $content ) || empty( $content ) ) {
		return;
	}

	foreach ( $content as $index => $block ) {
		if ( ! is_object( $block ) && is_array( $block ) && isset( $block['blockName'] ) ) {

			if ( 'formello/button' === $block['blockName'] && isset( $block['attrs']['form_id'] ) ) {
				$id = $block['attrs']['form_id'];
				$remove = array_shift( $block['attrs'] );
				$data[ $id ] = $block['attrs'];
			}

			if ( 'core/block' === $block['blockName'] ) {
				if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
					$atts = $block['attrs'];

					if ( isset( $atts['ref'] ) ) {
						$reusable_block = get_post( $atts['ref'] );

						if ( $reusable_block && 'wp_block' === $reusable_block->post_type && 'publish' === $reusable_block->post_status ) {
							$reuse_data_block = parse_blocks( $reusable_block->post_content );

							if ( ! empty( $reuse_data_block ) ) {
								$data = formello_get_block_data( $reuse_data_block, $data );
							}
						}
					}
				}
			}

			if ( isset( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$data = formello_get_block_data( $block['innerBlocks'], $data, $depth );
			}
		}
	}

	return $data;
}

/**
 * Generate css from array
 *
 * @param array $rules Data used to generate CSS.
 */
function formello_get_parsed_css( $rules, $indent = 0 ) {

	$normal = array();
	$hover = array();

	foreach ( $rules as $key => $value ) {
		$normal[ $key ] = array_filter(
			$value,
			function( $key ) {
				return substr( $key, -5 ) !== 'Hover';
			},
			ARRAY_FILTER_USE_KEY
		);
		$hover[ $key . ':hover' ] = array_filter(
			$value,
			function( $key ) {
				return substr( $key, -5 ) === 'Hover';
			},
			ARRAY_FILTER_USE_KEY
		);
	}

	$rules = $normal + $hover;

	return formello_parse_css( $rules );

}

/**
 * Generate css from array
 *
 * @param array $rules Data used to generate CSS.
 * @param array $indent Data used to generate CSS.
 * @param array $pseudoClass Data used to generate CSS.
 */
function formello_parse_css( $rules, $indent = 0, $pseudoClass = '' ) {

	$arrayUnits = array( 'border-width', 'border-radius', 'font-size' );

	$css = '';
	$prefix = str_repeat( '  ', $indent );

	foreach ( $rules as $key => $value ) {
		if ( is_array( $value ) ) {
			$selector = formello_get_css_selector( $key );
			$properties = $value;

			$css .= $prefix . "$selector {";
			$css .= $prefix . formello_parse_css( $properties, $indent + 1 );
			$css .= $prefix . "}";
		} else {
			$property = strtolower( preg_replace( '/([a-zA-Z])(?=[A-Z])/', '$1-', $key ) );
			$property = str_replace( '-hover', '', $property );
			if ( in_array( $property, $arrayUnits ) ) {
				$value .= 'px';
			}
			$property = str_replace( 'background-color-opacity', '', $property );
			$css .= $prefix . $property . ": $value;";
		}
	}

	return $css;
}

/**
 * Generate css from array
 *
 * @param array $key Data used to generate CSS.
 */
function formello_get_css_selector( $key ) {

	$key = explode( ':', $key );
	$selector = '#formello-' . $key[0] . ' .wp-block-formello-button';
	$selector .= ' button';
	if ( ! empty( $key[1] ) ) {
		$selector .= ':' . $key[1];
	}
	return $selector;
}
