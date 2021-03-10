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

?>

<h2>
<?php
	esc_html_e( wp_sprintf( 'Submission %d', $submission->id ), 'formello' );
?>
</h2>
<div class="wrap">
	<style type="text/css">
		table.formello-bordered {
		font-size: 13px;
		border-collapse: collapse;
		border-spacing: 0;
		background: white;
		width: 100%;
		table-layout: fixed;
		}
		table.formello-bordered th,
		table.formello-bordered td {
			border: 1px solid #ddd;
			padding: 12px;
		}
		table.formello-bordered th {
			width: 160px;
			font-size: 14px;
			text-align: left;
		}
	</style>
	<div>
		<h3><?php esc_html_e( 'Fields', 'formello' ); ?></h3>
		<table class="formello-bordered">
			<tbody>
			<?php
			if ( is_array( $submission->data ) ) {
				foreach ( $submission->data as $field => $value ) {
					echo '<tr>';
					echo sprintf( '<th>%s</th>', esc_html( str_replace( '_', ' ', ucfirst( strtolower( $field ) ) ) ) );
					echo '<td>';
					esc_html_e( $this->formello_field_value( $value ) );
					echo '</td>';
					echo '</tr>';
				}
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
				<td><?php echo sprintf( '<a href="%s">%s</a>', esc_attr( $submission->referer_url ), esc_html( $submission->referer_url ) ); ?></td>
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
