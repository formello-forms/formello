<div class="wrap">
<?php
/**
 * The submissions veiew
 *
 * @package Formello
 */

defined( 'ABSPATH' ) || exit;

$this->notice;

if ( ! $this->submission ) {
	$this->create_link();
	wp_die();
}
if ( $this->submission->is_new ) {
	$data->viewed();
	$formello_result = get_transient( 'formello_news', false );
	if ( $formello_result ) {
		set_transient( 'formello_news', $formello_result - 1, DAY_IN_SECONDS );
	}
}
?>

<h1 class="wp-heading-inline">
<?php
echo esc_attr(
	wp_sprintf(
		/* Translators: %s is the name of the form */
		__( 'Submission %d', 'formello' ),
		$this->submission->id
	)
);
?>
</h1>
<a href="<?php echo esc_attr( $this->back_button ); ?>" class="page-title-action">&lsaquo; <?php esc_html_e( 'Back to submissions list', 'formello' ); ?></a>
<hr class="wp-header-end">
<div class="wrap">
	<div>
		<h3><?php esc_html_e( 'Fields', 'formello' ); ?></h3>
		<table class="formello-bordered">
			<tbody>
			<?php
			foreach ( $this->submission->data as $formello_field => $formello_value ) {
				echo '<tr>';
				echo sprintf( '<th>%s</th>', esc_html( str_replace( '_', ' ', ucfirst( strtolower( $formello_field ) ) ) ) );
				echo '<td>';
				// phpcs:ignore
				echo \Formello\Utils\Formatter::format(
					$formello_value,
					! empty( $this->settings['fields'][ $formello_field ] ) ?
						$this->settings['fields'][ $formello_field ] :
						$formello_value,
					0 // disable string limit.
				);
				echo '</td>';
				echo '</tr>';
			}
			?>
			</tbody>
		</table>
	</div>
	<div>
		<h3><?php esc_html_e( 'Additional info', 'formello' ); ?></h3>
		<table class="formello-bordered">
			<tbody>
			<tr>
				<th><?php esc_html_e( 'Timestamp', 'formello' ); ?></th>
				<td><?php echo esc_html( \Formello\Utils\Formatter::format( $this->submission->submitted_at, 'date' ) ); ?></td>
			</tr>

			<?php if ( ! empty( $this->submission->user_agent ) ) { ?>
			<tr>
				<th><?php esc_html_e( 'User Agent', 'formello' ); ?></th>
				<td><?php echo esc_html( $this->submission->user_agent ); ?></td>
			</tr>
			<?php } // end if user_agent ?>

			<?php if ( ! empty( $this->submission->ip_address ) ) { ?>
			<tr>
				<th><?php esc_html_e( 'IP Address', 'formello' ); ?></th>
				<td><?php echo esc_html( $this->submission->ip_address ); ?></td>
			</tr>
			<?php } // end if ip_address ?>

			<tr>
				<th><?php esc_html_e( 'Referrer URL', 'formello' ); ?></th>
				<td><?php echo sprintf( '<a href="%s" target="_blank">%s</a>', esc_attr( $this->submission->referer_url ), esc_html( $this->submission->referer_url ) ); ?></td>
			</tr>
			</tbody>
		</table>
	</div>


</div>

<div>
	<p>
		<a href="<?php echo esc_attr( $this->back_button ); ?>">&lsaquo; <?php esc_html_e( 'Back to submissions list', 'formello' ); ?></a>
	</p>
</div>
</div>
