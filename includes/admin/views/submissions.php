<?php
/**
 * The submissions veiew
 *
 * @package Formello
 */

defined( 'ABSPATH' ) || exit;

$this->submissions_table->prepare_items();

?>
<div class="wrap">

<h1 class="wp-heading-inline">
<?php
echo esc_attr(
	wp_sprintf(
		/* Translators: %s is the name of the form */
		__( 'Submissions for %s', 'formello' ),
		isset( $title ) ? $title : '(No title)'
	)
);
?>
</h1>
<a href="<?php echo esc_attr( $this->back_button ); ?>" class="page-title-action">&lsaquo; <?php esc_html_e( 'Back to forms list', 'formello' ); ?></a>
<hr class="wp-header-end">
<?php
$this->notice;
?>

<form method="post">
<?php
	$this->submissions_table->search_box( 'search', 'search_id' );
	$this->submissions_table->views();
	$this->submissions_table->display();
?>
</form>

<div class="hf-small-margin">
	<p><a href="<?php echo esc_attr( $this->back_button ); ?>">&lsaquo; <?php esc_html_e( 'Back to forms list', 'formello' ); ?></a></p>
</div>
