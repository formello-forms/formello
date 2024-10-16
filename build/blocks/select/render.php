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

$p = new \WP_HTML_Tag_Processor( $content );
// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'field-' );

if ( $p->next_tag( 'label' ) ) {
	$p->set_attribute( 'for', $unique_id );
}

if ( $p->next_tag( array( 'tag_name' => 'select' ) ) ) {
	$p->set_attribute( 'id', $unique_id );
}

echo $p->get_updated_html();
