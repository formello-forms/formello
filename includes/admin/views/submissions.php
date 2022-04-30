<?php
/**
 * The submissions veiew
 *
 * @package Formello
 */

defined( 'ABSPATH' ) || exit;

$this->submissions_table->prepare_items();

$formello_nonce = wp_create_nonce( 'formello' );

$formello_all = sprintf(
	'<a href="?post_type=formello_form&page=%s&form_id=%s&paged=%s&_wpnonce=%s">%s</a>',
	'formello-submissions',
	isset( $_REQUEST['form_id'] ) ? absint( $_REQUEST['form_id'] ) : '',
	isset( $_REQUEST['paged'] ) ? sanitize_text_field( $_REQUEST['paged'] ) : '',
	$formello_nonce,
	__( 'All' )
);

$formello_news = sprintf(
	'<a href="?post_type=formello_form&page=%s&form_id=%s&new=1&_wpnonce=%s" class="%s">%s <span class="count">(%d)</span></a>',
	'formello-submissions',
	isset( $_REQUEST['form_id'] ) ? absint( $_REQUEST['form_id'] ) : '',
	$formello_nonce,
	isset( $_REQUEST['new'] ) ? 'current' : '',
	__( 'Unread', 'formello' ),
	$this->submissions_table->get_news()
);

$formello_starred = sprintf(
	'<a href="?post_type=formello_form&page=%s&form_id=%s&starred=1&_wpnonce=%s" class="%s">%s <span class="count">(%d)</span></a>',
	'formello-submissions',
	isset( $_REQUEST['form_id'] ) ? absint( $_REQUEST['form_id'] ) : '',
	$formello_nonce,
	isset( $_REQUEST['starred'] ) ? 'current' : '',
	__( 'Starred', 'formello' ),
	$this->submissions_table->get_favorites()
);

?>
<div class="wrap">

<h1 class="wp-heading-inline">
<?php
echo esc_attr(
	wp_sprintf(
		/* Translators: %s is the name of the form */
		__( 'Submissions for %s', 'formello' ),
		isset( $title ) ? $title : ''
	)
);
?>
</h1>
<a href="<?php echo esc_attr( $this->back_button ); ?>" class="page-title-action">&lsaquo; <?php esc_html_e( 'Back to forms list', 'formello' ); ?></a>
<hr class="wp-header-end">
<ul class="subsubsub">
	<li class="draft">
		<?php echo wp_kses_post( $formello_all ); ?> | 
	</li>
	<li class="draft">
		<?php echo wp_kses_post( $formello_news ); ?> | 
	</li>
	<li class="draft">
		<?php echo wp_kses_post( $formello_starred ); ?>
	</li>
<?php
$this->notice;
do_action( 'formello_forms_table' );
?>
</ul>

<form method="post">
<?php
	$this->submissions_table->search_box( 'search', 'search_id' );
	$this->submissions_table->display();
?>
</form>

<div class="hf-small-margin">
	<p><a href="<?php echo esc_attr( $this->back_button ); ?>">&lsaquo; <?php esc_html_e( 'Back to forms list', 'formello' ); ?></a></p>
</div>
