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
		return new \WP_Error( 404, __( 'Submission Not Found.', 'formello' ) );
	}

	/**
	 * Mark as viewed.
	 */
	public function viewed() {
		global $wpdb;
		$submission_table = $wpdb->prefix . 'formello_submissions';

		$wpdb->update( $submission_table, array( 'is_new' => false ), array( 'id' => $this->id ) );
	}

	/**
	 * Mark as starred.
	 */
	public function starred() {
		global $wpdb;
		$submission_table = $wpdb->prefix . 'formello_submissions';

		$wpdb->update( $submission_table, array( 'starred' => true ), array( 'id' => $this->id ) );
	}

	/**
	 * Retrieve submission object.
	 *
	 * @param Formello\Submission $object The submission object.
	 * @return stdClass $submission.
	 */
	public function from_object( $object ) {
		$object->data = empty( $object->data ) ? array() : json_decode( $object->data, true );
		return $object;
	}

	/**
	 * Retrieve newly submitted submissions.
	 *
	 * @since 1.2.0
	 */
	public static function get_news() {

		global $wpdb;
		$table_submissions  = "{$wpdb->prefix}formello_submissions";
		$table_posts  = "{$wpdb->prefix}posts";

		$result = $wpdb->get_row(
			$wpdb->prepare(
				'SELECT count(*) as total FROM `%1s` s WHERE s.is_new = 1 AND EXISTS( SELECT * FROM `%1s` f WHERE f.id = s.form_id AND f.post_type = %s AND ( f.post_status = %s OR f.post_status = %s )  );',
				array(
					'table_submissions' => $table_submissions,
					'table_posts' => $table_posts,
					'post_type' => 'formello_form',
					'post_status' => 'publish',
					'post_status_private' => 'formello-private',
				)
			)
		);

		set_transient( 'formello_news', $result->total, DAY_IN_SECONDS );

	}

}
