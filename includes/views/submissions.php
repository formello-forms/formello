<div class="wrap">
<?php

defined( 'ABSPATH' ) or exit;

//$submissions = new Formello\Tables\Submissions();

$form_name = isset( $_GET['form_name'] ) ? $_GET['form_name'] : '';

?>

<h2><?php echo sprintf( __( 'Submissions for %s form', 'formello' ), $form_name ); ?></h2>

<style type="text/css">
.column-id { text-align: left; width:100px !important; overflow:hidden }
</style>

<form method="post">
  <?php
  $this->submissions_table->prepare_items();
  $this->submissions_table->display(); ?>
</form>

<div class="hf-small-margin">
    <p><a href="<?php echo esc_attr( remove_query_arg( [ 'form' , 'paged', 'form_name' ] ) ); ?>">&lsaquo; <?php _e( 'Back to forms list', 'formello' ); ?></a></p>
</div>