<?php

// scoper-autoload.php @generated by PhpScoper

$loader = require_once __DIR__.'/autoload.php';

// Aliases for the whitelisted classes. For more information see:
// https://github.com/humbug/php-scoper/blob/master/README.md#class-whitelisting
if (!class_exists('ComposerAutoloaderInitdf688030c867bd8521f7909e766f69c6', false) && !interface_exists('ComposerAutoloaderInitdf688030c867bd8521f7909e766f69c6', false) && !trait_exists('ComposerAutoloaderInitdf688030c867bd8521f7909e766f69c6', false)) {
    spl_autoload_call('Formello\ComposerAutoloaderInitdf688030c867bd8521f7909e766f69c6');
}

// Functions whitelisting. For more information see:
// https://github.com/humbug/php-scoper/blob/master/README.md#functions-whitelisting
if (!function_exists('composerRequiredf688030c867bd8521f7909e766f69c6')) {
    function composerRequiredf688030c867bd8521f7909e766f69c6() {
        return \Formello\composerRequiredf688030c867bd8521f7909e766f69c6(...func_get_args());
    }
}

return $loader;
