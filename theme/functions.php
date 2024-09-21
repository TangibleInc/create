<?php
use tangible\framework;

require_once __DIR__ . '/vendor/tangible/framework/index.php';
require_once __DIR__ . '/vendor/tangible/plugin-updater/index.php';

define('PROJECT_NAME_VERSION', '1.0.0');

add_action( 'after_setup_theme', function() {

  // $theme = framework\register_theme([
  //   'name' => 'project-name',
  //   'title' => 'project-title',
  //   'version' => PROJECT_NAME_VERSION,
  //   'file_path' => __FILE__,
  // ]);

  // tangible_plugin_updater()->register_theme([
  //   'name' => $theme->name,
  //   'file' => __FILE__,
  //   // 'license' => ''
  // ]);

  add_theme_support( 'wp-block-styles' );
  add_editor_style( 'style.css' );
});

add_action( 'wp_enqueue_scripts', function() {
  wp_enqueue_style(
    'theme-style',
    get_template_directory_uri() . '/assets/build/style.min.css',
    [],
    PROJECT_NAME_VERSION
  );
});
