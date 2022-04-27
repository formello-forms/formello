<?php
/**
 * Utils functions to sanitize and show input field values.
 *
 * @package formello
 * @since   1.0.0
 */

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
function formello_field_value($value, $limit = 150, $escape_function = 'esc_html')
{
    if ('' === $value) {
        return $value;
    }

    if (formello_is_file($value)) {
        $file_url = isset($value['url']) ? $value['url'] : '';
        if (isset($value['attachment_id'])) {
            $file_url = admin_url(sprintf('post.php?action=edit&post=%d', $value['attachment_id']));
        }
        $short_name = substr($value['name'], 0, 20);
        $suffix     = strlen($value['name']) > 20 ? '...' : '';
        return sprintf('<a href="%s">%s%s</a> (%s)', esc_attr($file_url), esc_html($short_name), esc_html($suffix), formello_human_filesize($value['size']));
    }

    if (formello_is_date($value)) {
        $date_format = get_option('date_format');
        return date_i18n($date_format, strtotime($value));
    }

    // join array-values with comma.
    if (is_array($value)) {
        $value = join(', ', $value);
    }

    // limit string to certain length.
    if ($limit > 0) {
        $limited = strlen($value) > $limit;
        $value   = substr($value, 0, $limit);

        if ($limited) {
            $value .= '...';
        }
    }

    if ('on' === $value) {
        $value = __('Yes');
    }

    // escape value.
    if (null !== $escape_function && is_callable($escape_function)) {
        $value = $escape_function($value);
    }

    return $value;
}

/**
 * Returns true if value is a "file"
 *
 * @param mixed $value The file value.
 * @return bool
 */
function formello_is_file($value)
{
    return is_array($value)
        && isset($value['name'])
        && isset($value['size'])
        && isset($value['type']);
}

/**
 * Returns true if value looks like a date-string submitted from a <input type="date">
 *
 * @param mixed $value The date value.
 * @return bool
 * @since 1.0.0
 */
function formello_is_date($value)
{
    if (! is_string($value)
            || strlen($value) !== 10
            || (int) preg_match('/\d{2,4}[-\/]\d{2}[-\/]\d{2,4}/', $value) === 0) {
        return false;
    }

    $timestamp = strtotime($value);
    return false !== $timestamp;
}

/**
 * Human file size
 *
 * @param int $size The size of file.
 * @param int $precision The precision.
 * @return string
 */
function formello_human_filesize($size, $precision = 2)
{
    // phpcs:ignore
    for ($i = 0; ($size / 1024) > 0.9; $i++, $size /= 1024) {
        // nothing, loop logic contains everything.
    }
    $steps = array( 'B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' );
    return round($size, $precision) . $steps[ $i ];
}
