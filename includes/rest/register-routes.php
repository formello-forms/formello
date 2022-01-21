<?php
/**
 * Register custom REST API routes.
 *
 * @package block-visibility
 * @since   1.3.0
 */

namespace Formello\Rest;

defined( 'ABSPATH' ) || exit;

/**
 * Function to register our new routes from the controller.
 */
function register_routes() {
	$template_controller = new Controllers\Template();
	$template_controller->register_routes();
	$license_controller = new Controllers\License();
	$license_controller->register_routes();
	$integrations_controller = new Controllers\Integrations();
	$integrations_controller->register_routes();
	$settings_controller = new Controllers\Settings();
	$settings_controller->register_routes();
	$forms_controller = new Controllers\Forms();
	$forms_controller->register_routes();
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_routes' );

/**
 * Include our custom REST API controllers.
 */
require_once FORMELLO_ABSPATH . 'includes/rest/controllers/class-integrations.php';
require_once FORMELLO_ABSPATH . 'includes/rest/controllers/class-license.php';
require_once FORMELLO_ABSPATH . 'includes/rest/controllers/class-template.php';
require_once FORMELLO_ABSPATH . 'includes/rest/controllers/class-settings.php';
require_once FORMELLO_ABSPATH . 'includes/rest/controllers/class-forms.php';
