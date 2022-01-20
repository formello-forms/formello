<div class="wrap">
<?php

defined( 'ABSPATH' ) || exit;

$date_format     = get_option( 'date_format' );
$datetime_format = sprintf( '%s %s', $date_format, get_option( 'time_format' ) );
$submissions_page = add_query_arg( array( 'page' => 'formello-submissions' ) );

if ( $submission->is_new ) {
	global $wpdb;
	$submission_table = $wpdb->prefix . 'formello_submissions';

	$wpdb->update( $submission_table, array( 'is_new' => false ), array( 'id' => $submission->id ) );
}

$formello_fields = json_decode( $submission->data );

?>

<h1 class="wp-heading-inline">
<?php
	esc_html_e( wp_sprintf( 'Submission %d', $submission->id ), 'formello' );
?>
</h1>
<a href="<?php echo esc_attr( $submissions_page ); ?>" class="page-title">&lsaquo; <?php esc_html_e( 'Back to submissions list', 'formello' ); ?></a>
<hr class="wp-header-end">
<div class="wrap">
	<div>
		<h3><?php esc_html_e( 'Fields', 'formello' ); ?></h3>
		<table class="formello-bordered">
			<tbody>
			<?php
			foreach ( $formello_fields as $formello_field => $formello_value ) {
					echo '<tr>';
					echo sprintf( '<th>%s</th>', esc_html( str_replace( '_', ' ', ucfirst( strtolower( $formello_field ) ) ) ) );
					echo '<td>';
					// phpcs:ignore
					echo $this->formello_field_value( $formello_value, 500 );
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
				<td><?php esc_html_e( gmdate( $datetime_format, strtotime( $submission->submitted_at ) ) ); ?></td>
			</tr>

			<?php if ( ! empty( $submission->user_agent ) ) { ?>
			<tr>
				<th><?php esc_html_e( 'User Agent', 'formello' ); ?></th>
				<td><?php echo esc_html( $submission->user_agent ); ?></td>
			</tr>
			<?php } // end if user_agent ?>

			<?php if ( ! empty( $submission->ip_address ) ) { ?>
			<tr>
				<th><?php esc_html_e( 'IP Address', 'formello' ); ?></th>
				<td><?php echo esc_html( $submission->ip_address ); ?></td>
			</tr>
			<?php } // end if ip_address ?>

			<tr>
				<th><?php esc_html_e( 'Referrer URL', 'formello' ); ?></th>
				<td><?php echo sprintf( '<a href="%s" target="_blank">%s</a>', esc_attr( $submission->referer_url ), esc_html( $submission->referer_url ) ); ?></td>
			</tr>
			</tbody>
		</table>
	</div>


</div>

<div>
	<p>
		<a href="<?php echo esc_attr( $submissions_page ); ?>">&lsaquo; <?php esc_html_e( 'Back to submissions list', 'formello' ); ?></a>
	</p>
</div>
</div>
