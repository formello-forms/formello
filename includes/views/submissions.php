<div class="wrap">
<?php

defined( 'ABSPATH' ) || exit;

$form_name = isset( $_GET['form_name'] ) ? sanitize_text_field( wp_unslash( $_GET['form_name'] ) ) : '';

?>

<h2>
<?php
	esc_html_e( wp_sprintf( 'Submissions for %s', $form_name ), 'formello' );
?>
</h2>

<style type="text/css">
.column-id { text-align: left; width:100px !important; overflow:hidden }
</style>

<form method="post">
	<?php
	$this->submissions_table->prepare_items();
	$this->submissions_table->display();
	?>
</form>

<div class="hf-small-margin">
	<p><a href="<?php echo esc_attr( remove_query_arg( array( 'form', 'paged', 'form_name' ) ) ); ?>">&lsaquo; <?php esc_html_e( 'Back to forms list', 'formello' ); ?></a></p>
</div>
