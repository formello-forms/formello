<?php
/**
 * Submission class
 *
 * @package Formello
 */

namespace Formello;

/**
 * Block Handler
 *
 * @since 1.5.0
 */
class Submission {

	/**
	 * The form ID
	 *
	 * @var Int
	 */
	protected $id;

	/**
	 * Form constructor.
	 *
	 * @param int $id The form id.
	 */
	public function __construct( $id = 0 ) {
		$this->id = $id;
	}

	/**
	 * Select submission from DB
	 *
	 * @return stdClass $submission The submission.
	 */
	public function get() {
		if ( empty( $this->id ) ) {
			return null;
		}
		global $wpdb;
		$submission = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT s.* FROM {$wpdb->prefix}formello_submissions s WHERE s.id = %d;",
				array( $this->id )
			)
		);
		if ( $submission ) {
			return $this->from_object( $submission );
		}
		return $submission;
	}

	/**
	 * Retrieve object.
	 */
	public function viewed() {
		global $wpdb;
		$submission_table = $wpdb->prefix . 'formello_submissions';

		$wpdb->update( $submission_table, array( 'is_new' => false ), array( 'id' => $this->id ) );
	}

	/**
	 * Retrieve object.
	 *
	 * @param Formello\Submission $object The submission object.
	 * @return stdClass $submission.
	 */
	public function from_object( $object ) {
		$object->data = empty( $object->data ) ? array() : json_decode( $object->data, true );
		return $object;
	}
}
