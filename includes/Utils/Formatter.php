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
			case 'password':
				$value = self::format_password( $value );
				break;
			default:
				$value = self::formello_field_value( $value, $limit );
		}

		// limit string to certain length.
		if ( ! is_array( $value ) && $limit > 0 ) {
			$limited = strlen( $value ) > $limit;
			$value   = substr( $value, 0, $limit );

			if ( $limited ) {
				$value .= '...';
			}
		}

		if ( 'on' === $value ) {
			$value = __( 'Yes' );
		}

		if ( is_array( $value ) ) {
			$value = self::format_array( $value );
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
		if ( false === filter_var( $value, FILTER_VALIDATE_URL ) ) {
			return nl2br( $value );
		}
		return sprintf(
			'<a href="%s" target="_blank">%s</a>',
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
		$time_format = get_option( 'time_format' );
		return esc_attr( date_i18n( $date_format . ' ' . $time_format, strtotime( $value ) ) );
	}

	/**
	 * Returns a formatted & HTML-escaped field value. Detects file-, array- and date-types.
	 *
	 * Caveat: if value is a file, an HTML string is returned (which means email action should use "Content-Type: html" when it includes a file field).
	 *
	 * @param string|array   $value The value of input.
	 * @param int            $limit The limit.
	 * @param Closure|string $escape_function The function for escaping.
	 * @return string
	 * @since 1.0.0
	 */
	private static function formello_field_value( $value, $limit = 150, $escape_function = 'wp_kses_post' ) {
		if ( '' === $value ) {
			return $value;
		}

		if ( self::formello_is_file( $value ) ) {
			$file_url = isset( $value['url'] ) ? $value['url'] : '';
			if ( isset( $value['attachment_id'] ) ) {
				$file_url = admin_url( sprintf( 'post.php?action=edit&post=%d', $value['attachment_id'] ) );
			}
			$short_name = substr( $value['name'], 0, 20 );
			$suffix     = strlen( $value['name'] ) > 20 ? '...' : '';
			return sprintf( '<a href="%s">%s%s</a> (%s)', esc_attr( $file_url ), esc_html( $short_name ), esc_html( $suffix ), $value['size'] );
		}

		if ( self::formello_is_date( $value ) ) {
			$date_format = get_option( 'date_format' );
			return date_i18n( $date_format, strtotime( $value ) );
		}

		// join array-values with comma.
		if ( is_array( $value ) ) {
			$value = join( ', ', $value );
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

		// escape value.
		if ( null !== $escape_function && is_callable( $escape_function ) ) {
			$value = $escape_function( $value );
		}

		return $value;
	}

	/**
	 * Returns an obscured string.
	 *
	 * @param mixed $value The file value.
	 * @return bool
	 */
	private static function format_password( $value ) {
		return str_repeat( '*', strlen( $value ) );
	}

	/**
	 * Returns true if value is a "file"
	 *
	 * @param mixed $value The file value.
	 * @return bool
	 */
	private static function formello_is_file( $value ) {
		return is_array( $value )
			&& isset( $value['name'] )
			&& isset( $value['size'] )
			&& isset( $value['type'] );
	}

	/**
	 * Returns true if value looks like a date-string submitted from a <input type="date">
	 *
	 * @param mixed $value The date value.
	 * @return bool
	 * @since 1.0.0
	 */
	private static function formello_is_date( $value ) {
		if ( ! is_string( $value )
				|| strlen( $value ) !== 10
				|| (int) preg_match( '/\d{2,4}[-\/]\d{2}[-\/]\d{2,4}/', $value ) === 0 ) {
			return false;
		}

		$timestamp = strtotime( $value );
		return false !== $timestamp;
	}

	/**
	 * Human file size
	 *
	 * @param int $size The size of file.
	 * @param int $precision The precision.
	 * @return string
	 */
	private static function formello_human_filesize( $size, $precision = 2 ) {
	    // phpcs:ignore
	    for ($i = 0; ($size / 1024) > 0.9; $i++, $size /= 1024) {
			// nothing, loop logic contains everything.
		}
		$steps = array( 'B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' );
		return round( $size, $precision ) . $steps[ $i ];
	}
}
