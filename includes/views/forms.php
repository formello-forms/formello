<div class="wrap">
<h2><?php esc_html_e( 'Forms', 'formello' ); ?></h2>
<style type="text/css">
.column-id { text-align: left; width:100px !important; overflow:hidden }
</style>
<?php
defined( 'ABSPATH' ) || exit;

$this->forms_table->prepare_items();
$this->forms_table->display();


?>
</div>
