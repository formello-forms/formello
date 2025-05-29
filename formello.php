<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.francescopepe.com
 * @since             1.0.0
 * @package           Formello
 *
 * @wordpress-plugin
 * Plugin Name:       Formello
 * Plugin URI:        https://formello.net
 * Description:       Lightweight Gutenberg contact form builder, blazingly fast with no external dependencies and ReCaptcha support.
 * Version:           2.7.1
 * Author:            Tropicalista
 * Author URI:        https://www.francescopepe.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       formello
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
defined( 'ABSPATH' ) || exit;

require __DIR__ . '/vendor/autoload.php';

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-formello2-activator.php
 */
function formello_activate() {
	Formello\Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-formello2-deactivator.php
 */
function formello_deactivate() {
	Formello\Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'formello_activate' );
register_deactivation_hook( __FILE__, 'formello_deactivate' );

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function formello_run() {
	$plugin = new Formello\Plugin( __FILE__ );
	$plugin->run();
}
formello_run();
