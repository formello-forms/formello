<?php
/**
 * Register custom REST API routes.
 *
 * @package formello
 * @since   1.3.0
 */

namespace Formello\Rest;

defined( 'ABSPATH' ) || exit;

/**
 * Function to register our new routes from the controller.
 */
function register_routes() {
	$base_controller = new Controllers\Base();
	$base_controller->register_routes();
	$submissions_controller = new Controllers\Submissions();
	$submissions_controller->register_routes();
	$columns_controller = new Controllers\Columns();
	$columns_controller->register_routes();
	$template_controller = new Controllers\Template();
	$template_controller->register_routes();
	$addons_controller = new Controllers\Addons();
	$addons_controller->register_routes();
	$license_controller = new Controllers\License();
	$license_controller->register_routes();
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_routes' );

/**
 * Include our custom REST API controllers.
 */
require_once FORMELLO_ABSPATH . 'includes/Rest/Controllers/Base.php';
require_once FORMELLO_ABSPATH . 'includes/Rest/Controllers/Template.php';
require_once FORMELLO_ABSPATH . 'includes/Rest/Controllers/Addons.php';
require_once FORMELLO_ABSPATH . 'includes/Rest/Controllers/License.php';
require_once FORMELLO_ABSPATH . 'includes/Rest/Controllers/Submissions.php';
require_once FORMELLO_ABSPATH . 'includes/Rest/Controllers/Columns.php';
