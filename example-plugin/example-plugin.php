<?php
/**
 * Plugin Name: Example Plugin
 * Plugin URI: https://tangibleplugins.com/example-plugin
 * Description: Description of example plugin
 * Version: 0.1.1
 * Author: Team Tangible
 * Author URI: https://teamtangible.com
 * License: GPLv2 or later
 */
use tangible\framework;
use tangible\updater;

define( 'EXAMPLE_PLUGIN_VERSION', '0.1.1' );

require __DIR__ . '/vendor/tangible/framework/index.php';
require __DIR__ . '/vendor/tangible/updater/index.php';

/**
 * Get plugin instance
 */
function example_plugin($instance = false) {
  static $plugin;
  return $plugin ? $plugin : ($plugin = $instance);
}

add_action('plugins_loaded', function() {

  $plugin    = framework\register_plugin([
    'name'           => 'example-plugin',
    'title'          => 'Example Plugin',
    'setting_prefix' => 'example_plugin',
    'version'        => EXAMPLE_PLUGIN_VERSION,
    'file_path' => __FILE__,
    'base_path' => plugin_basename( __FILE__ ),
    'dir_path' => plugin_dir_path( __FILE__ ),
    'url' => plugins_url( '/', __FILE__ ),
    'assets_url' => plugins_url( '/assets', __FILE__ ),
  ]);

  updater\register_plugin([
    'name' => $plugin->name,
    'file' => __FILE__,    
  ]);

  example_plugin( $plugin );

  require_once __DIR__.'/includes/index.php';

}, 10);
