<div class="wrap">
<h2><?php _e( 'Forms', 'formello' ); ?></h2>
<style type="text/css">
.column-id { text-align: left; width:100px !important; overflow:hidden }
</style>
<?php
defined( 'ABSPATH' ) or exit;

//$forms = new Formello\Tables\Forms();
$this->forms_table->prepare_items();
//$this->forms_table->search_box( __( 'Find', 'formello' ), 'nds-user-find');
$this->forms_table->display();


?>
</div>