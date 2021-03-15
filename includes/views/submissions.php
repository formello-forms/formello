<div class="wrap">
<?php

defined( 'ABSPATH' ) || exit;

$form_page = add_query_arg( array( 'page' => 'formello' ) );
?>

<h2>
<?php
	esc_html_e( wp_sprintf( 'Submissions for %s', $form->name ), 'formello' );
?>
</h2>

<style type="text/css">
.column-id { text-align: left; width:50px !important; overflow:hidden }
.column-is_new { text-align: left; width:50px !important; overflow:hidden }
.badge { background-color: #337ab7; height: 10px; width: 10px; display: inline-block; border-radius: 50%; }
</style>

<form method="post">
	<?php
	$this->submissions_table->prepare_items();
	//$this->submissions_table->search_box( 'search', 'search_id' );
	$this->submissions_table->display();
	?>
</form>

<div class="hf-small-margin">
	<p><a href="<?php echo esc_attr( $form_page ); ?>">&lsaquo; <?php esc_html_e( 'Back to forms list', 'formello' ); ?></a></p>
</div>
