<?php
/**
 * Tag replacer
 *
 * @package Formello
 */

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
		if ( 'all_data' === $param ) {
			return $this->all_fields();
		}
		return isset( $_POST[ $param ] ) ? wp_kses_post( $_POST[ $param ] ) : '';
	}

	/**
	 * Retrieve all fields.
	 *
	 * @return mixed
	 */
	public function all_fields() {
		if ( is_rtl() ) {
			$return = '<table style="direction: rtl; border: 1px solid #dedede;">';
		} else {
			$return = '<table>';
		}

		foreach ( $_POST as $field => $value ) {
			if ( '_' === $field[0] || 'action' === $field ) {
				continue;
			};

			if ( is_array( $value ) ) {
				$value = implode( ', ', $value );
			};

			$value = wp_kses_post( $value );

			$return .= '<tr><td><b>' . $field . '</b>:</td><td>' . $value . '</td></tr>';
		}
		$return .= '</table>';
		return $return;
	}
}
