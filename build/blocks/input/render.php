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
 */

$replacer = new Formello\TagReplacers\Replacer();
$p = new \WP_HTML_Tag_Processor( $content );
// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'field-' );

if ( $p->next_tag( 'label' ) ) {
	$p->set_attribute( 'for', $unique_id );
}

if ( $p->next_tag( array( 'tag_name' => 'input' ) ) ) {

	$p->set_attribute( 'id', $unique_id );
	$p->set_attribute( 'value', $replacer->parse( $p->get_attribute( 'value' ) ) );

	if ( 'range' === $p->get_attribute( 'type' ) ) {
		$p->set_attribute( 'data-wp-on--input', 'actions.setOutput' );
	}

	if ( 'password' === $p->get_attribute( 'type' ) ) {
		wp_enqueue_script( 'password-strength-meter' );
	}
	if ( 'formello-advanced' === $p->get_attribute( 'class' ) && 'date' === $p->get_attribute( 'type' ) ) {
		wp_enqueue_script(
			'flatpickr',
			'https://cdn.jsdelivr.net/npm/flatpickr',
			array(),
			false,
			array(
				'strategy' => 'defer',
			),
		);
		wp_enqueue_style( 'flatpickr', 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css' );
	}
}

echo $p->get_updated_html();
