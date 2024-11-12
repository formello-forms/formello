<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 * @link       https://www.francescopepe.com
 * @since      1.0.0
 *
 * @package    Formello
 * @subpackage Formello/includes
 */

$p = new \WP_HTML_Tag_Processor( $content );
// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'field-' );

if ( $p->next_tag( 'label' ) ) {
	$p->set_attribute( 'for', $unique_id );
}

if ( $p->next_tag( array( 'tag_name' => 'select' ) ) ) {
	$p->set_attribute( 'id', $unique_id );
	if ( $p->get_attribute( 'multiple' ) ) {
		$p->set_attribute( 'name', $p->get_attribute( 'name' ) . '[]' );
	}

	$p->set_attribute( 'data-wp-on--input', 'actions.validateInput' );
	$p->set_attribute( 'data-wp-on--blur', 'actions.validateInput' );
	$p->set_attribute( 'data-wp-on--invalid', 'actions.validateInput' );

	if ( $p->has_class( 'formello-advanced' ) ) {
		$p->set_attribute( 'autocomplete', 'off' );
		wp_enqueue_script(
			'tom-select',
			'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/js/tom-select.complete.min.js',
			array(),
			false, // phpcs:ignore
			array(
				'strategy' => 'defer',
			)
		);
		// phpcs:ignore
		wp_enqueue_style( 'tom-select', 'https://cdn.jsdelivr.net/npm/tom-select@2.3.1/dist/css/tom-select.css' );
	}
}

echo $p->get_updated_html();
