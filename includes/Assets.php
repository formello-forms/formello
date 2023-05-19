<?php
/**
 * Manage all assets.
 *
 * @package Formello
 */

namespace Formello;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use function Formello\Utils\formello_frontend_option;

/**
 * Scripts and Styles Class
 *
 * @since 1.0.0
 */
class Assets {

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
		if ( is_admin() ) {
			add_action( 'admin_enqueue_scripts', array( $this, 'register' ), 5 );
		} else {
			add_action( 'wp_enqueue_scripts', array( $this, 'register' ), 5 );
		}
	}

	/**
	 * Register our app scripts and styles
	 *
	 * @return void
	 */
	public function register() {
		$this->register_scripts( $this->get_scripts() );
		$this->register_styles( $this->get_styles() );
	}

	/**
	 * Register scripts
	 *
	 * @param  array $scripts The array of scripts.
	 *
	 * @return void
	 */
	private function register_scripts( $scripts ) {
		foreach ( $scripts as $handle => $script ) {
			$deps      = isset( $script['deps'] ) ? $script['deps'] : false;
			$in_footer = isset( $script['in_footer'] ) ? $script['in_footer'] : false;
			$version   = isset( $script['version'] ) ? $script['version'] : FORMELLO_VERSION;

			wp_register_script( $handle, $script['src'], $deps, $version, $in_footer );
		}
		wp_set_script_translations( 'formello-form-block-editor', 'formello', FORMELLO_ABSPATH . 'languages' );

		$settings = array(
			'settings' => get_option( 'formello' ),
			'post_url' => esc_url( admin_url( 'admin-post.php' ) ),
			'can_use_premium_code' => (int) is_plugin_active( 'formello-pro/formello-pro.php' ),
		);

		wp_localize_script(
			'formello-form-view-script',
			'formello',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'settings' => formello_frontend_option(),
			)
		);

		/**
		* Filter to add additional JS to editor.
		*
		* @param array $settings
		*/
		$settings = apply_filters( 'formello_backend_settings', $settings );

		wp_add_inline_script( 'formello-addons', 'const formello = ' . wp_json_encode( $settings ), 'before' );
		wp_add_inline_script( 'formello-settings', 'const formello = ' . wp_json_encode( $settings ), 'before' );
		wp_add_inline_script( 'formello-form-editor-script', 'const formello = ' . wp_json_encode( $settings ), 'before' );

	}

	/**
	 * Register styles
	 *
	 * @param  array $styles The array of styles.
	 *
	 * @return void
	 */
	public function register_styles( $styles ) {
		foreach ( $styles as $handle => $style ) {
			$deps = isset( $style['deps'] ) ? $style['deps'] : false;

			wp_register_style( $handle, $style['src'], $deps, FORMELLO_VERSION );
		}
	}

	/**
	 * Get all registered scripts
	 *
	 * @return array
	 * @throws \Error Assets not loaded.
	 */
	public function get_scripts() {
		$settings_asset_path = FORMELLO_ABSPATH . '/build/settings.asset.php';
		$submission_asset_path = FORMELLO_ABSPATH . '/build/submission.asset.php';
		if ( ! file_exists( $settings_asset_path ) ) {
			throw new \Error(
				'You need to run `npm start` or `npm run build` for the "create-block/formello" block first.'
			);
		}

		$settings_script_asset = require $settings_asset_path;
		$submission_script_asset = require $settings_asset_path;

		$scripts = array(
			'formello-settings' => array(
				'src'       => FORMELLO_ASSETS . '/settings.js',
				'deps'      => $settings_script_asset['dependencies'],
				'version'   => $settings_script_asset['version'],
				'in_footer' => true,
			),
			'formello-addons' => array(
				'src'       => FORMELLO_ASSETS . '/addons.js',
				'deps'      => $settings_script_asset['dependencies'],
				'version'   => $settings_script_asset['version'],
				'in_footer' => true,
			),
			'formello-submission' => array(
				'src'       => FORMELLO_ASSETS . '/submission.js',
				'deps'      => $submission_script_asset['dependencies'],
				'version'   => $submission_script_asset['version'],
				'in_footer' => true,
			),
		);

		/**
		* Filter to add additional JS to dashboard.
		*
		* @param array $scripts
		*/
		$scripts = apply_filters( 'formello_scripts', $scripts );

		return $scripts;
	}

	/**
	 * Get registered styles
	 *
	 * @return array
	 */
	public function get_styles() {
		$styles = array(
			'formello-form-block-editor' => array(
				'src' => FORMELLO_ASSETS . '/index.css',
			),
			'formello-form-block'        => array(
				'src' => FORMELLO_ASSETS . '/style-index.css',
			),
			'formello-settings'          => array(
				'src'  => FORMELLO_ASSETS . '/style-settings.css',
				'deps' => array( 'wp-components', 'wp-reset-editor-styles' ),
			),
		);

		return $styles;
	}

}
Assets::get_instance();
