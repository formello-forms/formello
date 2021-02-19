<?php
/**
 * Manage Data submitted.
 *
 * @package Formello
 */

namespace Formello;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Data Handler
 *
 * @since 1.0.0
 */
class Data {

	/**
	 * The replacer
	 *
	 * @var $replacer
	 */
	private $replacer;
	private $form_id;
	private $ignored_field_names;
	private $data        = array();
	private $ip_address  = '';
	private $user_agent  = '';
	private $referer_url = '';
	private $submitted_at;

	/**
	 * Constructor
	 *
	 * @param Int   $form_id The form ID.
	 * @param Array $ignored_field_names The fields to ignore.
	 */
	public function __construct( $form_id, $ignored_field_names = array() ) {
		$this->replacer            = new TagReplacers\Replacer();
		$this->form_id             = $form_id;
		$this->ignored_field_names = $ignored_field_names;
		$this->process( $_POST );
	}

	/**
	 * Process data
	 *
	 * @param array $data the data submitted.
	 */
	public function process( $data ) {

		// filter out ignored field names.
		foreach ( $data as $key => $value ) {
			$this->data[ sanitize_key( $key ) ] = $this->sanitize( $value );
		}
		$this->ip_address   = ! empty( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$this->user_agent   = ! empty( $_SERVER['HTTP_USER_AGENT'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
		$this->referer_url  = ! empty( $_SERVER['HTTP_REFERER'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_REFERER'] ) ) : '';
		$this->submitted_at = gmdate( 'Y-m-d H:i:s' );
	}

	/**
	 * Sanitize array with values before saving. Can be called recursively.
	 *
	 * @param mixed $value the value to sanitize.
	 * @return mixed
	 */
	public function sanitize( $value ) {
		if ( is_string( $value ) ) {
			// do nothing if empty string.
			if ( '' === $value ) {
				return $value;
			}

			// strip slashes.
			$value = stripslashes( $value );

			// strip all whitespace.
			$value = trim( $value );

			// convert &amp; back to &.
			$value = html_entity_decode( $value, ENT_NOQUOTES );
			$value = $this->replace_tags( $value );

		} elseif ( is_array( $value ) || is_object( $value ) ) {
			$new_value = array();
			$vars      = is_array( $value ) ? $value : get_object_vars( $value );

			// do nothing if empty array or object.
			if ( count( $vars ) === 0 ) {
				return $value;
			}

			foreach ( $vars as $key => $sub_value ) {
				// strip all whitespace & HTML from keys (!).
				$key = trim( wp_strip_all_tags( $key ) );

				// sanitize sub value.
				$new_value[ $key ] = $this->sanitize( $sub_value );
				$new_value[ $key ] = $this->replace_tags( $sub_value );
			}

			$value = is_object( $value ) ? (object) $new_value : $new_value;
		}

		return $value;
	}

	/**
	 * Replace tags if any.
	 *
	 * @param string $template String template.
	 */
	private function replace_tags( $template ) {

		$template = $this->replacer->parse( $template );

		return $template;

	}

	/**
	 * Save form submission in DB.
	 */
	public function save() {
		// remove useless data.
		$this->clean();

		global $wpdb;
		$table = $wpdb->prefix . 'formello_submissions';
		$data  = array(
			'data'    => wp_json_encode( $this->data ),
			'form_id' => $this->form_id,
		);

		foreach ( array( 'ip_address', 'user_agent', 'submitted_at', 'referer_url' ) as $prop ) {
			$data[ $prop ] = $this->$prop;
		}

		if ( ! empty( $this->id ) ) {
			$wpdb->update( $table, $data, array( 'id' => $this->id ) );
			return null;
		}

		// insert new row.
		$num_rows = $wpdb->insert( $table, $data );
		if ( $num_rows > 0 ) {
			$this->id = $wpdb->insert_id;
		}
	}

	/**
	 * Create an Data object from query.
	 *
	 * @param object $object The object query.
	 * @return Submission
	 */
	public static function from_object( $object ) {
		$data         = empty( $object->data ) ? array() : (array) json_decode( $object->data, true );
		$object->data = $data;
		return $object;
	}

	/**
	 * Get a Data array.
	 *
	 * @return array
	 */
	public function get_data() {
		return $this->data;
	}

	/**
	 * Get a clean Data array.
	 *
	 * @return array
	 */
	public function clean() {

		// filter out ignored field names.
		foreach ( $this->data as $key => $value ) {
			if ( '_' === $key[0] || in_array( $key, $this->ignored_field_names, false ) ) {
				unset( $this->data[ $key ] );
				continue;
			}

			// this detects the WPBruiser token field to ensure it isn't stored
			// CAVEAT: this will detect any non-uppercase string with 2 dashes in the field name and no whitespace in the field value.
			if ( class_exists( 'GoodByeCaptcha' ) && is_string( $key ) && is_string( $value ) && strtoupper( $key ) !== $key && substr_count( $key, '-' ) >= 2 && substr_count( trim( $value ), ' ' ) === 0 ) {
				unset( $this->data[ $key ] );
				continue;
			}

		}

	}

}
