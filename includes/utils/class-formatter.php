<?php
/**
 * Class Google\Site_Kit\Core\Storage\Data_Encryption
 *
 * @package   Formello
 */

namespace Formello\Utils;

/**
 * Class responsible for encrypting and decrypting data.
 *
 * @since 1.0.0
 * @access private
 * @ignore
 */
class Formatter {

	/**
	 * Encrypts a value.
	 *
	 * If a user-based key is set, that key is used. Otherwise the default key is used.
	 *
	 * @since 1.0.0
	 *
	 * @param string $value Value to format.
	 * @param string $column_type Column type.
	 * @param int    $limit Chars limit.
	 * @return string Formatted value.
	 */
	public static function format( $value, $column_type, $limit = 150 ) {

		switch ( $column_type ) {
			case 'select-multiple':
				$value = self::format_array( $value );
				break;
			case 'richtext':
				$value = self::format_rtf( $value );
				break;
			case 'date':
				$value = self::format_date( $value );
				break;
			case 'file':
				$value = self::format_file( $value );
				break;
			default:
				$value = $value;
		}

		// limit string to certain length.
		if ( $limit > 0 ) {
			$limited = strlen( $value ) > $limit;
			$value   = substr( $value, 0, $limit );

			if ( $limited ) {
				$value .= '...';
			}
		}

		if ( 'on' === $value ) {
			$value = __( 'Yes' );
		}

		return $value;
	}

	/**
	 * Format a value.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value Value to format.
	 * @return string Formatted value.
	 */
	private static function format_file( $value ) {
		if ( false === filter_var( $url, FILTER_VALIDATE_URL ) ) {
			return $value;
		}
		return sprintf(
			'<a href="%s">%s</a>',
			esc_attr( $value ),
			esc_html( $value )
		);
	}

	/**
	 * Gets the default encryption key to use.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value Value to format.
	 * @return string Formatted value.
	 */
	private static function format_array( $value ) {
		if ( is_array( $value ) ) {
			return esc_attr( join( ', ', $value ) );
		}
		return $value;
	}

	/**
	 * Gets the default encryption key to use.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value Value to format.
	 * @return string Formatted value.
	 */
	private static function format_rtf( $value ) {
		return wp_kses_post( $value );
	}

	/**
	 * Gets the default encryption key to use.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value Value to format.
	 * @return string Formatted value.
	 */
	private static function format_date( $value ) {
		if ( empty( $value ) ) {
			return $value;
		}
		$date_format = get_option( 'date_format' );
		return esc_attr( date_i18n( $date_format, strtotime( $value ) ) );
	}

}
