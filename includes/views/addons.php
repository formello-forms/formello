<?php
defined( 'ABSPATH' ) || exit;

$url	= 'https://formello.net/edd-api/products?nocache=' . time();
$addons = get_transient( 'formello_addons', false );

/*
 * Get remote addons.
 */
if ( ! $addons ) {
	$requested_addons = wp_remote_get( $url );

	if ( ! is_wp_error( $requested_addons ) ) {
		$new_addons = wp_remote_retrieve_body( $requested_addons );
		$new_addons = json_decode( $new_addons, true );

		if ( $new_addons && is_array( $new_addons ) ) {
			$addons = $new_addons;

			set_transient( 'formello_addons', $addons, DAY_IN_SECONDS );
		}
	} else {
		$addons = array();
	}
}

?>

<div class="wrap">
<h2><?php esc_html_e( 'Addons', 'formello' ); ?></h2>

<div class="formello-addons">
	
<?php foreach ( $addons['products'] as $item ) : ?>
	<div class="addon">
		<div class="logo">
		<a href="<?php echo esc_url( 'https://formello.net/downloads/' . $item['info']['slug'] ); ?>" target="_blank" rel="noopener noreferrer">
			<img src="<?php echo esc_url( FORMELLO_URL . '/assets/addon_images/' . $item['info']['slug'] . '-772x250.png' ); ?>" alt="<?php echo esc_attr( $item['info']['slug'] ); ?>">
		</a>
		</div>
		<div class="caption">
			<h3><a href="<?php echo esc_url( 'https://formello.net/downloads/' . $item['info']['slug'] ); ?>" class="unstyled"><?php echo esc_html( $item['info']['title'] ); ?></a></h3>
			<p><?php echo esc_html( $item['info']['excerpt'] ); ?></p>
			<p>
				<a class="button" href="<?php echo esc_url( 'https://formello.net/downloads/' . $item['info']['slug'] ); ?>" title="More about <?php echo esc_attr( $item['info']['slug'] ); ?>">Get this Extension</a>
				<span class="type"><?php echo '0.00' === $item['pricing']['amount'] ? 'FREE' : esc_attr( $item['pricing']['amount'] ); ?></span>
			</p>
		</div>
	</div>
<?php endforeach; ?>

</div>

</div>
