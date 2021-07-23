<div class="wrap">
<?php

defined( 'ABSPATH' ) || exit;

$this->submissions_table->prepare_items();

$form_page = add_query_arg( array( 'page' => 'formello' ) );
$all = remove_query_arg( array( 'new' ) );
$new_submission = add_query_arg( array( 'new' => 1 ) );
?>

<h1>
<?php
	esc_html_e( wp_sprintf( 'Submissions for %s', $form->name ), 'formello' );
?>
</h1>

<ul class="subsubsub">
	<li class="draft">
		<a href="<?php echo esc_attr( $new_submission ); ?>"><?php esc_html_e( 'New' ); ?>
			<span class="count">
				(<?php echo esc_attr( $this->submissions_table->get_news() ); ?>)
			</span>
		</a> | 
	</li>
	<li class="draft">
		<a href="<?php echo esc_attr( $new_submission ); ?>"><?php esc_html_e( 'Starred', 'formello' ); ?>
			<span class="count">
				(<?php echo esc_attr( $this->submissions_table->get_favorites() ); ?>)
			</span>
		</a>
	</li>
<?php
do_action( 'formello_forms_table' );
?>
</ul>

<style type="text/css">
.column-id { text-align: left; width:50px !important; overflow:hidden }
.column-actions { text-align: left; width: 150px !important; overflow:hidden }
.column-is_new { text-align: left; width:90px !important; overflow:hidden }
.badge { color: #337ab7; font-size: 14px; margin-top: 3px; }
</style>

<form method="post">
	<?php
	//$this->submissions_table->search_box( 'search', 'search_id' );
	$this->submissions_table->display();
var_dump($this->submissions_table->get_news());
	?>
</form>

<div class="hf-small-margin">
	<p><a href="<?php echo esc_attr( $form_page ); ?>">&lsaquo; <?php esc_html_e( 'Back to forms list', 'formello' ); ?></a></p>
</div>
