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

$replacer = new Formello\TagReplacers\Replacer();
$p = new \WP_HTML_Tag_Processor( $content );
// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'field-' );

if ( $p->next_tag( array( 'tag_name' => 'div' ) ) ) {
	$p->set_attribute( 'data-wp-context', '' );
}

if ( $p->next_tag( 'label' ) ) {
	$p->set_attribute( 'for', $unique_id );
}

if ( $p->next_tag( array( 'tag_name' => 'input' ) ) ) {

	$p->set_attribute( 'id', $unique_id );
	$p->set_attribute( 'value', $replacer->parse( $p->get_attribute( 'value' ) ) );

	$p->set_attribute( 'data-wp-on--input', 'actions.validateInput' );
	$p->set_attribute( 'data-wp-on--blur', 'actions.validateInput' );
	$p->set_attribute( 'data-wp-on--invalid', 'actions.validateInput' );

	if ( 'range' === $p->get_attribute( 'type' ) ) {
		$p->set_attribute( 'data-wp-on--input', 'actions.setOutput' );
	}

	if ( $p->get_attribute( 'multiple' ) ) {
		$p->set_attribute( 'name', $p->get_attribute( 'name' ) . '[]' );
	}

	if ( 'tel' === $p->get_attribute( 'type' ) && ! empty( $attributes['advanced'] ) ) {
		wp_enqueue_script(
			'intl-tel',
			'https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/js/intlTelInput.min.js',
			array(),
			false, // phpcs:ignore
			array(
				'strategy' => 'defer',
			)
		);
		// phpcs:ignore
		wp_enqueue_style( 'intl-tel', 'https://cdn.jsdelivr.net/npm/intl-tel-input@24.6.0/build/css/intlTelInput.css' );
	}

	if ( 'password' === $p->get_attribute( 'type' ) ) {
		wp_enqueue_script( 'password-strength-meter' );
	}

	if ( ! empty( $attributes['advanced'] ) && ( 'date' === $p->get_attribute( 'type' ) || 'time' === $p->get_attribute( 'type' ) ) ) {
		$p->set_attribute( 'type', 'text' );

		wp_enqueue_script(
			'flatpickr',
			'https://cdn.jsdelivr.net/npm/flatpickr',
			array(),
			false, // phpcs:ignore
			array(
				'strategy' => 'defer',
			)
		);
		// phpcs:ignore
		wp_enqueue_style( 'flatpickr', 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css' );
	}
}

if ( $p->next_tag( 'button' ) ) {
	$p->set_attribute( 'data-wp-bind--disabled', 'context.isLoading' );
	$p->set_attribute( 'data-wp-class--wp-block-formello-button--loading', 'context.isLoading' );
}

echo $p->get_updated_html();
