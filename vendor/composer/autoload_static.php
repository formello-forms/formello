<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitdf688030c867bd8521f7909e766f69c6
{
    public static $files = array (
        '0c4dff0430e9906a4e175b46345a6ef0' => __DIR__ . '/../..' . '/includes/defaults.php',
    );

    public static $prefixLengthsPsr4 = array (
        'F' => 
        array (
            'Formello\\Rakit\\Validation\\' => 26,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Formello\\Rakit\\Validation\\' => 
        array (
            0 => __DIR__ . '/..' . '/rakit/validation/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'Formello\\Actions\\Action' => __DIR__ . '/../..' . '/includes/Actions/class-action.php',
        'Formello\\Actions\\Email' => __DIR__ . '/../..' . '/includes/Actions/class-email.php',
        'Formello\\Admin' => __DIR__ . '/../..' . '/includes/class-admin.php',
        'Formello\\Api' => __DIR__ . '/../..' . '/includes/class-api.php',
        'Formello\\Api\\Form' => __DIR__ . '/../..' . '/includes/Api/class-form.php',
        'Formello\\Api\\Settings' => __DIR__ . '/../..' . '/includes/Api/class-settings.php',
        'Formello\\Assets' => __DIR__ . '/../..' . '/includes/class-assets.php',
        'Formello\\Block' => __DIR__ . '/../..' . '/includes/class-block.php',
        'Formello\\Data' => __DIR__ . '/../..' . '/includes/class-data.php',
        'Formello\\Form' => __DIR__ . '/../..' . '/includes/class-form.php',
        'Formello\\Frontend' => __DIR__ . '/../..' . '/includes/class-frontend.php',
        'Formello\\Tables\\Forms' => __DIR__ . '/../..' . '/includes/Tables/class-forms.php',
        'Formello\\Tables\\Submissions' => __DIR__ . '/../..' . '/includes/Tables/class-submissions.php',
        'Formello\\TagReplacers\\Fields' => __DIR__ . '/../..' . '/includes/TagReplacers/class-fields.php',
        'Formello\\TagReplacers\\Other' => __DIR__ . '/../..' . '/includes/TagReplacers/class-other.php',
        'Formello\\TagReplacers\\Replacer' => __DIR__ . '/../..' . '/includes/TagReplacers/class-replacer.php',
        'Formello\\TagReplacers\\Wp' => __DIR__ . '/../..' . '/includes/TagReplacers/class-wp.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitdf688030c867bd8521f7909e766f69c6::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitdf688030c867bd8521f7909e766f69c6::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitdf688030c867bd8521f7909e766f69c6::$classMap;

        }, null, ClassLoader::class);
    }
}
