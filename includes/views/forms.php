<div class="wrap">
<h2><?php esc_html_e( 'Forms', 'formello' ); ?></h2>
<style type="text/css">
.column-id { text-align: left; width:100px !important; overflow:hidden }
.badge { background-color: #337ab7; padding: 0 5px; margin-left: 10px; color: white; border-radius: 20%; }
</style>
<?php
defined( 'ABSPATH' ) || exit;
?>

<form method="post">
	<?php
	$this->forms_table->prepare_items();
	$this->forms_table->search_box( 'Search', 'search' );
	$this->forms_table->display();
	?>
</form>

</div>
