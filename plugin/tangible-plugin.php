<?php
/**
 * Plugin Name: <%= project.title %>
 * Plugin URI: https://tangibleplugins.com/<%= project.name %>
 * Description: <%= project.description %>
 * Version: 0.0.1
 * Author: Team Tangible
 * Author URI: https://teamtangible.com
 * License: GPLv2 or later
 */

define( '<%= constant(project.name) %>_VERSION', '0.0.1' );

require __DIR__ . '/vendor/tangible/framework/index.php';
require __DIR__ . '/vendor/tangible/plugin-updater/index.php';

/**
 * Get plugin instance
 */
function <%= snake(project.name) %>($instance = false) {
  static $plugin;
  return $plugin ? $plugin : ($plugin = $instance);
}

add_action('plugins_loaded', function() {

  $plugin    = tangible\framework\register_plugin([
    'name'           => '<%= project.name %>',
    'title'          => '<%= project.title %>',
    'setting_prefix' => '<%= snake(project.name) %>',

    'version'        => <%= constant(project.name) %>_VERSION,
    'file_path'      => __FILE__,
    'base_path'      => plugin_basename( __FILE__ ),
    'dir_path'       => plugin_dir_path( __FILE__ ),
    'url'            => plugins_url( '/', __FILE__ ),
    'assets_url'     => plugins_url( '/assets', __FILE__ ),
  ]);

  <%= snake(project.name) %>( $plugin );

  tangible_plugin_updater()->register_plugin([
    'name' => $plugin->name,
    'file' => __FILE__,
    // 'license' => ''
  ]);

  require_once __DIR__.'/includes/index.php';

}, 10);
