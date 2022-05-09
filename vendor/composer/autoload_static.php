<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit89fc8527d43a83151b23dbe63359ada2
{
    public static $files = array (
        'dbe920d25ef8abb2ed635ba56cd8a6d6' => __DIR__ . '/../..' . '/includes/utils/functions.php',
        '154a9dd6be49f608c90f9b4bab3f6132' => __DIR__ . '/../..' . '/includes/register-cpt.php',
        'bd19d6a91140de072ebbaaece830094f' => __DIR__ . '/../..' . '/includes/register-settings.php',
    );

    public static $prefixLengthsPsr4 = array (
        'F' => 
        array (
            'Formello\\Rakit\\Validation\\' => 26,
            'Formello\\Psr\\Log\\' => 17,
            'Formello\\Katzgrau\\KLogger\\' => 26,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Formello\\Rakit\\Validation\\' => 
        array (
            0 => __DIR__ . '/..' . '/rakit/validation/src',
        ),
        'Formello\\Psr\\Log\\' => 
        array (
            0 => __DIR__ . '/..' . '/psr/log/Psr/Log',
        ),
        'Formello\\Katzgrau\\KLogger\\' => 
        array (
            0 => __DIR__ . '/..' . '/katzgrau/klogger/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'EDD_SL_Plugin_Updater' => __DIR__ . '/../..' . '/includes/EDD_SL_Plugin_Updater.php',
        'Formello' => __DIR__ . '/../..' . '/includes/class-formello.php',
        'Formello\\Actions\\Action' => __DIR__ . '/../..' . '/includes/actions/class-action.php',
        'Formello\\Actions\\Email' => __DIR__ . '/../..' . '/includes/actions/class-email.php',
        'Formello\\Admin\\Admin' => __DIR__ . '/../..' . '/includes/admin/class-admin.php',
        'Formello\\Admin\\Tables\\Forms' => __DIR__ . '/../..' . '/includes/admin/tables/class-forms.php',
        'Formello\\Admin\\Tables\\Submissions' => __DIR__ . '/../..' . '/includes/admin/tables/class-submissions.php',
        'Formello\\Assets' => __DIR__ . '/../..' . '/includes/class-assets.php',
        'Formello\\Blocks' => __DIR__ . '/../..' . '/includes/class-blocks.php',
        'Formello\\Cron' => __DIR__ . '/../..' . '/includes/class-cron.php',
        'Formello\\Form' => __DIR__ . '/../..' . '/includes/class-form.php',
        'Formello\\Frontend' => __DIR__ . '/../..' . '/includes/class-frontend.php',
        'Formello\\Katzgrau\\KLogger\\Logger' => __DIR__ . '/..' . '/katzgrau/klogger/src/Logger.php',
        'Formello\\Log' => __DIR__ . '/../..' . '/includes/class-logger.php',
        'Formello\\Rest\\Controllers\\Base' => __DIR__ . '/../..' . '/includes/rest/controllers/class-base.php',
        'Formello\\Rest\\Controllers\\Forms' => __DIR__ . '/../..' . '/includes/rest/controllers/class-forms.php',
        'Formello\\Rest\\Controllers\\Integrations' => __DIR__ . '/../..' . '/includes/rest/controllers/class-integrations.php',
        'Formello\\Rest\\Controllers\\License' => __DIR__ . '/../..' . '/includes/rest/controllers/class-license.php',
        'Formello\\Rest\\Controllers\\Template' => __DIR__ . '/../..' . '/includes/rest/controllers/class-template.php',
        'Formello\\Submission' => __DIR__ . '/../..' . '/includes/class-submission.php',
        'Formello\\TagReplacers\\Fields' => __DIR__ . '/../..' . '/includes/tag-replacers/class-fields.php',
        'Formello\\TagReplacers\\Other' => __DIR__ . '/../..' . '/includes/tag-replacers/class-other.php',
        'Formello\\TagReplacers\\Replacer' => __DIR__ . '/../..' . '/includes/tag-replacers/class-replacer.php',
        'Formello\\TagReplacers\\Wp' => __DIR__ . '/../..' . '/includes/tag-replacers/class-wp.php',
        'Formello\\Updater' => __DIR__ . '/../..' . '/includes/class-updater.php',
        'Formello\\Utils\\Encryption' => __DIR__ . '/../..' . '/includes/utils/class-encryption.php',
        'Formello\\Utils\\Formatter' => __DIR__ . '/../..' . '/includes/utils/class-formatter.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit89fc8527d43a83151b23dbe63359ada2::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit89fc8527d43a83151b23dbe63359ada2::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit89fc8527d43a83151b23dbe63359ada2::$classMap;

        }, null, ClassLoader::class);
    }
}
