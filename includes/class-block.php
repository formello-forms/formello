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
	 * Class instance.
	 *
	 * @access private
	 * @var $instance Class instance.
	 */
	private static $instance;

	/**
	 * Initiator
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_blocks' ) );
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ) );
	}

	/**
	 * Register our dynamic blocks.
	 *
	 * @since 1.2.0
	 */
	public function register_blocks() {
		register_block_type(
			'formello/form-reusable',
			array(
				'attributes' => array(
					'id' => array(
						'type'    => 'number',
						'default' => 0,
					),
				),
				'render_callback' => array( $this, 'do_reusable_block' ),
			)
		);

		register_block_type(
			'formello/form',
			array(
				'attributes'      => array(
					'recaptchaEnabled' => array(
						'type'    => 'boolean',
						'default' => true,
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
				'render_callback' => array( $this, 'do_formello_block' ),
			)
		);

	}

	/**
	 * Render block on frontend
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 */
	public function do_formello_block( $attributes, $content = '', $block ) {

		$settings = get_option( 'formello', formello_get_option_defaults() );
		$recaptcha_url = 'https://www.google.com/recaptcha/api.js';

		if ( ! is_admin() && $attributes['recaptchaEnabled'] && ! empty( $settings['recaptcha']['site_key'] ) ) {
			if ( 1 === (int) $settings['recaptcha']['version'] ) {
				wp_enqueue_script( 'google-recaptcha', $recaptcha_url . '?onload=formelloCallback&render=explicit', array(), FORMELLO_VERSION, true );
			} else {
				wp_enqueue_script( 'google-recaptcha', $recaptcha_url . '?render=' . $settings['recaptcha']['site_key'], array(), FORMELLO_VERSION, true );
			}
		}

		wp_enqueue_script( 'formello-form-block' );
		wp_enqueue_style( 'formello-form-block' );

		wp_localize_script(
			'formello-form-block',
			'formello',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'settings' => $settings,
			)
		);

		return $content;

	}

	/**
	 * Render block
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 */
	public function do_reusable_block( $attributes, $content = '' ) {

		if ( empty( $attributes['id'] ) ) {
			return '';
		}

		$form = get_post( $attributes['id'] );

		if ( ! $form || 'formello_form' !== $form->post_type ) {
			return '';
		}

		if ( 'publish' !== $form->post_status || ! empty( $form->post_password ) ) {
			return '';
		}

		return do_blocks( $form->post_content );

	}

	/**
	 * Add formello block category
	 *
	 * @param  array $categories The categories of Gutenberg.
	 */
	public function register_block_category( $categories ) {
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
