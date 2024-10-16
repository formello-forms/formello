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

if ( $p->next_tag( array( 'tag_name' => 'textarea' ) ) ) {

	$p->set_attribute( 'id', $unique_id );
	if ( 'formello-rtf' === $p->get_attribute( 'class' ) ) {
		wp_enqueue_script(
			'tiny-mce',
			'https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.3/tinymce.min.js',
			array(),
			false,
			array(
				'strategy' => 'defer',
			),
		);
	}
}

echo $replacer->parse( $p->get_updated_html() );
