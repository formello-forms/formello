<?php
/**
 * Block handler.
 *
 * @package Formello
 */

namespace Formello;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Block Handler
 *
 * @since 1.0.0
 */
class Block {

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_block' ) );
		add_filter( 'block_categories', array( $this, 'formello_block_category' ) );
	}

	/**
	 * Render frontend app
	 *
	 * @param  array  $attrs The attributes of block.
	 * @param  string $content The bock content.
	 */
	public function register_block( $attrs, $content = '' ) {

		register_block_type(
			'formello/form',
			array(
				'attributes'      => array(
					'recaptchaEnabled' => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'storeSubmissions' => array(
						'type'    => 'boolean',
						'default' => false,
					),
					'hide'             => array(
						'type'    => 'boolean',
						'default' => false,
					),
				),
				'editor_script'   => 'formello-form-block-editor',
				'editor_style'    => 'formello-form-block-editor',
				'style'           => 'formello-form-block',
				//'script'          => 'formello-form-block',
				'render_callback' => function( $attributes, $content = null ) {

					$settings = get_option( 'formello', formello_get_option_defaults() );
					$recaptcha_url = 'https://www.google.com/recaptcha/api.js';

					if ( $attributes['recaptchaEnabled'] && ! empty( $settings['recaptcha']['site_key'] ) ) {
						if ( 1 === (int) $settings['recaptcha']['version'] ) {
							wp_enqueue_script( 'google-recaptcha', $recaptcha_url . '?onload=formelloCallback&render=explicit', array(), FORMELLO_VERSION, true );
						} else {
							wp_enqueue_script( 'google-recaptcha', $recaptcha_url . '?render=' . $settings['recaptcha']['site_key'], array(), FORMELLO_VERSION, true );
						}
					}

					wp_enqueue_script( 'formello-form-block' );
					wp_enqueue_style( 'formello-form-block' );

					return $content;
				},
			)
		);

	}

	/**
	 * Add formello block category
	 *
	 * @param  array $categories The categories of Gutenberg.
	 */
	public function formello_block_category( $categories ) {
		return array_merge(
			$categories,
			array(
				array(
					'slug'  => 'formello',
					'title' => __( 'Formello' ),
				),
			)
		);
	}

}
