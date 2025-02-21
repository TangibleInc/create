<?php
use tangible\framework;
use tangible\updater;

define('EXAMPLE_THEME_VERSION', '1.0.0');

require __DIR__ . '/vendor/tangible/framework/index.php';
require __DIR__ . '/vendor/tangible/updater/index.php';

add_action( 'after_setup_theme', function() {

  $theme = framework\register_theme([
    'name' => 'example-theme',
    'title' => 'Example Theme',
    'version' => EXAMPLE_THEME_VERSION,
    'file_path' => __FILE__,
  ]);

  updater\register_theme([
    'name' => $theme->name,
    'file' => __FILE__,
  ]);

  add_theme_support( 'wp-block-styles' );
  add_editor_style( 'style.css' );
});

add_action( 'wp_enqueue_scripts', function() {
  wp_enqueue_style(
    'theme-style',
    get_template_directory_uri() . '/assets/build/style.min.css',
    [],
    EXAMPLE_THEME_VERSION
  );
});
