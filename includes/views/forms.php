<?php
defined( 'ABSPATH' ) || exit;
?>

<div class="wrap">
<h2><?php esc_html_e( 'Forms', 'formello' ); ?></h2>

<form method="post">
	<?php
	$this->forms_table->prepare_items();
	$this->forms_table->search_box( 'Search', 'search' );
	$this->forms_table->display();
	?>
</form>

</div>
