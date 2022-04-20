<?php

namespace Formello\Views;

defined( 'ABSPATH' ) || exit;


$formello_url    = 'https://formello.net/edd-api/products?nocache=' . time();
$formello_addons = get_transient( 'formello_addons', false );

/*
 * Get remote addons.
 */
if ( ! $formello_addons ) {
	$formello_requested_addons = wp_remote_get( $formello_url );

	if ( ! is_wp_error( $formello_requested_addons ) ) {
		$formello_new_addons = wp_remote_retrieve_body( $formello_requested_addons );
		$formello_new_addons = json_decode( $formello_new_addons, true );

		if ( $formello_new_addons && is_array( $formello_new_addons ) ) {
			$formello_addons = $formello_new_addons;

			set_transient( 'formello_addons', $formello_addons, DAY_IN_SECONDS );
		}
	} else {
		$formello_addons = array();
	}
}

?>

<div class="wrap">
	<div class="formello-addons-main">
		<h1><?php esc_html_e( 'Addons', 'formello' ); ?></h1>		
	</div>

	<div class="formello-addons">

		<?php foreach ( $formello_addons['products'] as $formello_item ) : ?>
			<div class="addon">
				<div class="logo">
				<a href="<?php echo esc_url( 'https://formello.net/downloads/' . $formello_item['info']['slug'] ); ?>" target="_blank" rel="noopener noreferrer">
					<img src="<?php echo esc_url( FORMELLO_PLUGIN_URL . '/assets/addon_images/' . $formello_item['info']['slug'] . '-772x250.png' ); ?>" alt="<?php echo esc_attr( $formello_item['info']['slug'] ); ?>">
				</a>
				</div>
				<h3>
					<a target="_blank" href="<?php echo esc_url( 'https://formello.net/downloads/' . $formello_item['info']['slug'] ); ?>" class="unstyled"><?php echo esc_html( $formello_item['info']['title'] ); ?></a>
				</h3>
				<p><?php echo esc_html( $formello_item['info']['excerpt'] ); ?></p>
				<footer>
					<a  target="_blank" class="button" href="<?php echo esc_url( 'https://formello.net/downloads/' . $formello_item['info']['slug'] ); ?>" title="More about <?php echo esc_attr( $formello_item['info']['slug'] ); ?>">Get this Extension</a>
				</footer>
			</div>
		<?php endforeach; ?>

	</div>

</div>
