<?php

namespace Formello;

class Submission {
	public $id;
	public $form_id;
	public $data        = array();
	public $ip_address  = '';
	public $user_agent  = '';
	public $referer_url = '';
	public $submitted_at;

	public function save() {
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
			return;
		}

		// insert new row.
		$num_rows = $wpdb->insert( $table, $data );
		if ( $num_rows > 0 ) {
			$this->id = $wpdb->insert_id;
		}
	}

	/**
	 * Get submission object from DB
	 *
	 * @param object $object The query Object.
	 * @return Submission
	 */
	public static function from_object( $object ) {
		$data = empty( $object->data ) ? array() : (array) json_decode( $object->data, true );
		$object->data = $data;
		return $object;
	}

}
