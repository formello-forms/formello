<?php
defined( 'ABSPATH' ) || exit;

$addons = array(
	'Mailchimp' => array(
		'name' => 'Mailchimp',
		'type' => 'free',
		'slug' => 'mailchimp',
		'description' => 'With Mailchimp addon you can easily subscribe your leads to your Mailchimp list and start collecting thousand of emails.'
	),
	'Inserter' => array(
		'name' => 'Inserter',
		'type' => 'free',
		'slug' => 'inserter',
		'description' => 'Automatically insert any forms at the end or in the middle of your posts and set exclusions by categories or tags.'
	),
);
$count = 0;
?>

<div class="wrap">
<h2><?php esc_html_e( 'Addons', 'formello' ); ?></h2>
<style type="text/css">
.plugin {
	width: 320px;
	border: 1px solid #ccc;
	margin: 0 20px 20px 0;
	float: left;
	background-color: #fff;
	padding: 10px;
}
.plugin img {
	max-width: 100%;
	height: auto;	
}
.plugin .type {
	float: right;
	text-transform: uppercase;
	font-weight: bold;
}
</style>

<?php foreach ( $addons as $item ) : ?>
	<div class="plugin">
		<div class="logo">
		<a href="<?php echo esc_url( 'https://formello.net/downloads/' . $item['slug'] ); ?>" class="unstyled">
			<img src="<?php echo esc_url( FORMELLO_URL . '/assets/addon_images/' . $item['slug'] . '.png' ); ?>" alt="<?php echo $item['slug']; ?>">
		</a>
		</div>
		<div class="caption">
			<h3><a href="<?php echo esc_url( 'https://formello.net/downloads/' . $item['slug'] ); ?>" class="unstyled"><?php echo esc_html( $item['name'] ); ?></a></h3>
			<p><?php echo esc_html( $item['description'] ); ?></p>
			<p>
				<a class="button" href="<?php echo esc_url( 'https://formello.net/downloads/' . $item['slug'] ); ?>" title="More about <?php echo esc_attr( $item['slug'] ); ?>">Get this Extension</a>
				<span class="type"><?php echo $item['type']; ?></span>
			</p>
		</div>
	</div>
	<?php
	$i = $count+1;
	if ( ( $i + 1 ) % 4 === 0 ) {
		echo '<div style="clear: both;"></div>';
	}
	?>
<?php endforeach; ?>

</div>
