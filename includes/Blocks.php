<?php
/**
 * Block handler.
 *
 * @package Formello
 */

namespace Formello;

use function Formello\Utils\formello_default_options;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Block Handler
 *
 * @since 1.0.0
 */
class Blocks {

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
		add_action( 'init', array( $this, 'register_block_pattern_category' ) );
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ) );
		add_shortcode( 'formello', array( $this, 'do_reusable_block' ) );
	}

	/**
	 * Register our dynamic blocks.
	 *
	 * @since 1.2.0
	 */
	public function register_blocks() {
		register_block_type_from_metadata(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/form',
			array(
				'render_callback' => array( $this, 'do_formello_block' ),
			)
		);

		register_block_type_from_metadata(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/library',
			array(
				'render_callback' => array( $this, 'do_reusable_block' ),
			)
		);

		register_block_type_from_metadata(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/input',
		);

		register_block_type_from_metadata(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/textarea',
		);

		register_block_type_from_metadata(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/select',
		);

		register_block_type_from_metadata(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/fieldset'
		);

		register_block_type_from_metadata(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/multichoices'
		);

		register_block_type_from_metadata(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/output'
		);

		register_block_type_from_metadata(
			plugin_dir_path( FORMELLO_PLUGIN_FILE ) . 'build/blocks/button',
		);
	}

	/**
	 * Render form block on frontend
	 *
	 * @param  array  $attributes The attributes of block.
	 * @param  string $content The bock content.
	 */
	public function do_formello_block( $attributes, $content = '' ) {

		if ( $attributes['captchaEnabled'] && 'reCaptcha' === $attributes['captchaType'] ) {
			wp_enqueue_script( 'recaptcha', 'https://www.google.com/recaptcha/api.js' );
		}
		if ( $attributes['captchaEnabled'] && 'hCaptcha' === $attributes['captchaType'] ) {
			wp_enqueue_script( 'hcaptcha', 'https://js.hcaptcha.com/1/api.js' );
		}

		return $content;
	}

	/**
	 * Render form block
	 *
	 * @param array $attributes The attributes of block.
	 */
	public function do_reusable_block( $attributes ) {

		if ( empty( $attributes['ref'] ) ) {
			return '';
		}

		$form = get_post( $attributes['ref'] );

		if ( ! $form || 'formello' !== $form->post_type ) {
			return '';
		}

		if ( 'publish' !== $form->post_status || ! empty( $form->post_password ) ) {
			return '';
		}

		$config = wp_interactivity_config(
			'formello',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'settings' => \Formello\Utils\formello_frontend_options(),
			)
		);

		$form_context = \Formello\Utils\formello_form_context( $attributes['ref'] );

		wp_interactivity_state(
			'formello',
			array(
				'captcha' => array(
					'enabled' => $form_context['captchaEnabled'] ?? false,
					'type' => $form_context['captchaType'] ?? 'recaptcha',
				),
				'errors' => array(),
			)
		);

		$form = sprintf(
			'<form 
				data-wp-init="callbacks.init"
				data-wp-on--submit="actions.sendForm" 
				%s 
				data-wp-interactive="formello" 
				data-wp-bind--novalidate="context.noValidate" %s>
			%s
			<input type="text" name="_formello_h%d" class="formello-hp" tabindex="-1">
			%s
			<div class="formello-message" data-wp-class--success="context.response.success" data-wp-class--error="!context.response.success">
				<p data-wp-text="state.message"></p>
				<ul data-wp-context="state.errors">
					<template data-wp-each="state.errors" >
						<li data-wp-text="context.item"></li>
					</template>
				</ul>
			</div>
			%s
			</form>',
			get_block_wrapper_attributes(
				array( 'data-id' => $attributes['ref'] )
			),
			wp_interactivity_data_wp_context( $form_context ),
			wp_nonce_field( '_formello', '_formello', true, false ),
			$attributes['ref'],
			do_blocks( $form->post_content ),
			$form_context['debug'] ?
				'<div class="formello-debug">
					<p>Debug output</p>
					<small>This output is visible only to admin.</small>
					<pre data-wp-text="state.debugData"></pre>
				</div>' : '',
		);

		if ( $form_context['enableJsValidation'] ) {
			wp_enqueue_script( 'bouncer', 'https://cdn.jsdelivr.net/gh/cferdinandi/bouncer@1.4.6/dist/bouncer.min.js' );
		}

		return $form;
	}

	/**
	 * Add formello block category
	 *
	 * @param  array $categories The categories of Gutenberg.
	 */
	public function register_block_category( $categories ) {
		$currentScreen = get_current_screen();
		if ( 'formello' === $currentScreen->id ) {
			return array_merge(
				array(
					array(
						'slug'  => 'formello',
						'title' => __( 'Formello' ),
					),
				),
				$categories
			);
		}
		return array_merge(
			$categories,
			array(
				array(
					'slug'  => 'formello',
					'title' => __( 'Formello' ),
				),
			),
		);
	}

	/**
	 * Add formello block pattern category
	 */
	public function register_block_pattern_category() {
		register_block_pattern_category(
			'formello',
			array( 'label' => __( 'Form', 'formello' ) )
		);

		$patterns = json_decode(
			file_get_contents(
				FORMELLO_PLUGIN_DIR . '/assets/templates/patterns.json'
			),
			true
		);

		if ( ! $patterns ) {
			return;
		}

		foreach ( $patterns as $pattern ) {
			if ( empty( $pattern['name'] ) ) {
				continue;
			}
			register_block_pattern(
				$pattern['name'],
				$pattern
			);
		}
	}
}
Blocks::get_instance();
