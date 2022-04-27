<?php
/**
 * Setup Block Visibility
 *
 * @package formello
 * @since   1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Main Block Visibility Class.
 *
 * @since 1.0.0
 */
final class Formello
{
    /**
     * Return singleton instance of the Block Visibility plugin.
     *
     * @since 1.0.0
     * @return Formello
     */
    public static function instance()
    {
        static $instance = false;

        if (! $instance) {
            $instance = new self();
        }
        return $instance;
    }

    /**
     * Initialise the plugin.
     */
    private function __construct()
    {
        $this->define_constants();
        $this->formello_dir();
        $this->includes();
        $this->actions();
        $this->updater();
    }

    /**
     * Load required actions.
     *
     * @since 1.0.0
     */
    public function actions()
    {
        $email_action = new Formello\Actions\Email();
        $email_action->hook();
        add_action('init', array( $this, 'load_textdomain' ));
    }

    /**
     * Include required files.
     *
     * @since 1.0.0
     */
    public function includes()
    {

        // Require once the Composer Autoload.
        if (file_exists(dirname(FORMELLO_PLUGIN_FILE) . '/vendor/autoload.php')) {
            require_once dirname(FORMELLO_PLUGIN_FILE) . '/vendor/autoload.php';
        }

        // Needs to be included at all times due to show_in_rest.
        include_once FORMELLO_ABSPATH . 'includes/utils/functions.php';
        include_once FORMELLO_ABSPATH . 'includes/utils/class-encryption.php';
        include_once FORMELLO_ABSPATH . 'includes/register-settings.php';
        include_once FORMELLO_ABSPATH . 'includes/register-cpt.php';
        include_once FORMELLO_ABSPATH . 'includes/rest/register-routes.php';
        include_once FORMELLO_ABSPATH . 'includes/class-assets.php';
        include_once FORMELLO_ABSPATH . 'includes/class-blocks.php';
        include_once FORMELLO_ABSPATH . 'includes/class-frontend.php';
        include_once FORMELLO_ABSPATH . 'includes/class-form.php';
        include_once FORMELLO_ABSPATH . 'includes/actions/class-action.php';
        include_once FORMELLO_ABSPATH . 'includes/actions/class-email.php';
        include_once FORMELLO_ABSPATH . 'includes/class-logger.php';
        include_once FORMELLO_ABSPATH . 'includes/class-updater.php';

        // Utility functions that are also used by register-routes.php so
        // needs to be included at all times.

        // Only include in the admin.
        if (is_admin() && ! (defined('DOING_AJAX') && DOING_AJAX)) {
            include_once FORMELLO_ABSPATH . 'includes/utils/format-utils.php';
            include_once FORMELLO_ABSPATH . 'includes/admin/class-admin.php';
            include_once FORMELLO_ABSPATH . 'includes/admin/tables/class-forms.php';
            include_once FORMELLO_ABSPATH . 'includes/admin/tables/class-submissions.php';
        }
    }

    /**
     * Define the contants for the Block Visibility plugin.
     *
     * @since 1.4.0
     */
    private function define_constants()
    {
        $this->define('FORMELLO_ABSPATH', dirname(FORMELLO_PLUGIN_FILE) . '/');
        $this->define('FORMELLO_VERSION', get_file_data(FORMELLO_PLUGIN_FILE, [ 'Version' ])[0]); // phpcs:ignore
        $this->define('FORMELLO_PLUGIN_URL', plugin_dir_url(FORMELLO_PLUGIN_FILE));
        $this->define('FORMELLO_ASSETS', FORMELLO_PLUGIN_URL . 'build');
        $this->define('FORMELLO_PLUGIN_BASENAME', plugin_basename(FORMELLO_PLUGIN_FILE));
        $this->define('FORMELLO_SUPPORT_URL', 'https://wordpress.org/support/plugin/formllo/');
        $this->define('FORMELLO_SETTINGS_URL', admin_url('options-general.php?page=formllo-settings'));
        // this is the URL our updater / license checker pings. This should be the URL of the site with EDD installed.
        $this->define('FORMELLO_STORE_URL', 'https://formello.net');
    }

    /**
     * Define the formello dir.
     *
     * @since 1.4.0
     */
    private function formello_dir()
    {
        $upload_dir = wp_upload_dir();
        $formello_dir = $upload_dir['basedir'] . '/formello';
        if (! is_dir($formello_dir)) {
            wp_mkdir_p($formello_dir);
        }
        $this->define('FORMELLO_UPLOAD', $formello_dir);
    }

    /**
     * Define constant if not already set.
     *
     * @since 1.4.0
     *
     * @param string      $name  Constant name.
     * @param string|bool $value Constant value.
     */
    private function define($name, $value)
    {
        if (! defined($name)) {
            // phpcs:ignore
            define($name, $value);
        }
    }

    /**
     * Loads the plugin language files.
     *
     * @since 1.0.0
     */
    public function load_textdomain()
    {
        load_plugin_textdomain(
            'formello',
            false,
            dirname(FORMELLO_PLUGIN_BASENAME) . '/languages/'
        );
    }

    /**
     * Load plugin updater.
     *
     * @since 1.0.0
     */
    private function updater()
    {
        if (! is_admin()) {
            return;
        }

        $settings = get_option('formello');

        if (! $settings) {
            return;
        };

        $key = $settings['license'];

        if (! $key || ! $settings['license_status']) {
            $key = $settings['addon_licenses'];
        }

        // Fire a hook for Addons to register their updater since we know the key is present.
        do_action('formello_updater', $key);
    }

    /**
     * Cloning instances of the class is forbidden.
     *
     * @since 1.0.0
     */
    public function __clone()
    {
        _doing_it_wrong(
            __FUNCTION__,
            esc_html__('Cloning instances of the class is forbidden.', 'formello'),
            '1.0'
        );
    }

    /**
     * Unserializing instances of the class is forbidden.
     *
     * @since 1.0.0
     */
    public function __wakeup()
    {
        _doing_it_wrong(
            __FUNCTION__,
            esc_html__('Unserializing instances of the class is forbidden.', 'formello'),
            '1.0'
        );
    }
}
