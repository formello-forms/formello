<?php

namespace Formello\TagReplacers;

use WP_Post;

/**
 * Class Fields
 */
class Fields {

	/**
	 * Retrieve form data sanitized.
	 *
	 * @param string $param form data.
	 */
	public function get_data( $param ) {
		return isset( $_POST[ $param ] ) ? sanitize_text_field( wp_unslash( $_POST[ $param ] ) ) : false;
	}

	/**
	 * Retrieve all fields.
	 *
	 * @return mixed
	 */
	public function all_fields() {
		if ( is_rtl() ) {
			$return = '<table style="direction: rtl;">';
		} else {
			$return = '<table>';
		}

		$hidden_field_types = array( 'html', 'submit', 'password', 'passwordconfirm' );

		foreach ( $this->get_fields_sorted() as $field ) {

			if ( ! isset( $field['type'] ) ) continue;

			if ( in_array( $field['type'], array_values( $hidden_field_types ) ) ) continue;

			$field['value'] = apply_filters( 'ninja_forms_merge_tag_value_' . $field['type'], $field['value'], $field );

			if ( is_array( $field['value'] ) ) $field['value'] = implode( ', ', $field['value'] );

			$field = $this->maybe_sanitize( $field );

			$return .= '<tr><td>' . apply_filters( 'ninja_forms_merge_label', $field['label'], $field, $this->form_id ) . ':</td><td>' . $field['value'] . '</td></tr>';
		}
		$return .= '</table>';
		return $return;
	}

}
