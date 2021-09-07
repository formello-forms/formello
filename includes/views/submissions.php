<?php

defined( 'ABSPATH' ) || exit;

$this->submissions_table->prepare_items();

$nonce = wp_create_nonce('formello');

$all = sprintf(
	'<a href="?post_type=formello_form&page=%s&form=%s&paged=%s&_wpnonce=%s">%s</a>',
	'formello-submissions',
	sanitize_text_field( $_REQUEST['form'] ),
	isset( $_REQUEST['paged'] ) ? sanitize_text_field( $_REQUEST['paged'] ) : '',
	$nonce,
	__( 'All' )
);

$news = sprintf(
	'<a href="?post_type=formello_form&page=%s&form=%s&new=1&_wpnonce=%s">%s <span class="count">(%d)</span></a>',
	'formello-submissions',
	sanitize_text_field( $_REQUEST['form'] ),
	$nonce,
	__( 'Unread', 'formello' ),
	$this->submissions_table->get_news()
);

$starred = sprintf(
	'<a href="?post_type=formello_form&page=%s&form=%s&starred=1&_wpnonce=%s">%s <span class="count">(%d)</span></a>',
	'formello-submissions',
	sanitize_text_field( $_REQUEST['form'] ),
	$nonce,
	__( 'Starred', 'formello' ),
	$this->submissions_table->get_favorites()
);

$form_page = add_query_arg( array( 'page' => 'formello' ) );

?>
<div class="wrap">

<h1 class="wp-heading-inline">
<?php
	esc_html_e( wp_sprintf( 'Submissions for %s', $form->post_title ), 'formello' );
?>
</h1>
<a href="<?php echo esc_attr( $form_page ); ?>" class="page-title">&lsaquo; <?php esc_html_e( 'Back to forms list', 'formello' ); ?></a>
<hr class="wp-header-end">
<ul class="subsubsub">
	<li class="draft">
		<?php echo $all; ?> | 
	</li>
	<li class="draft">
		<?php echo $news; ?> | 
	</li>
	<li class="draft">
		<?php echo $starred; ?>
	</li>
<?php
do_action( 'formello_forms_table' );
?>
</ul>

<style type="text/css">
.column-id { text-align: left; width:50px !important; overflow:hidden }
.column-actions { text-align: left; width: 150px !important; overflow:hidden }
.column-is_new { text-align: left; width:70px !important; overflow:hidden }
.column-starred { text-align: left; width:10px !important; overflow:hidden }
.badge { color: #337ab7; font-size: 12px; margin-top: 3px; }
.star { color: #e27730; font-size: 12px; }
</style>

<form method="post">
<?php
	$this->submissions_table->search_box( 'search', 'search_id' );
	$this->submissions_table->display();
?>
</form>

<div class="hf-small-margin">
	<p><a href="<?php echo esc_attr( $form_page ); ?>">&lsaquo; <?php esc_html_e( 'Back to forms list', 'formello' ); ?></a></p>
</div>
