<?php
use tangible\framework;

framework\register_plugin_settings($plugin, [
  'css' => $plugin->assets_url . '/build/admin.min.css',
  'title_callback' => function() use ($plugin) {
    ?>
      <img class="plugin-logo"
        src="<?= $plugin->assets_url ?>/images/tangible-logo.png"
        alt="Test Logo"
        width="40"
      >
      <?= $plugin->title ?>
    <?php
  },
  'tabs' => [
    'welcome' => [
      'title' => 'Welcome',
      'callback' => function() {
        ?>Hello, world.<?php
      }
    ],
    'features' => [
      'title' => 'Features',
      'callback' => function() use ($plugin) {
        framework\render_features_settings_page($plugin);
      }
    ],
  ],

  'features' => [
    [
      'name' => 'example',
      'title' => 'First feature',
      'entry_file' => __DIR__ . '/../features/example.php'
    ],
    [
      'name' => 'example_2',
      'title' => 'Second feature',
      'entry_file' => __DIR__ . '/../features/example-2.php',
      // 'default' => true,
    ],
  ],

]);

framework\register_admin_notice(function() use ($plugin) {

  $welcome_notice_key = $plugin->setting_prefix . '_welcome_notice';

  if ( framework\is_admin_notice_dismissed( $welcome_notice_key ) ) {
    return;
  }

  if (isset($_GET['dismiss_admin_notice'])) {
    // Remove notice after clicking link to welcome page
    framework\dismiss_admin_notice( $welcome_notice_key );
    return;
  }

  ?>
  <div class="notice notice-info is-dismissible"
    data-tangible-admin-notice="<?php echo $welcome_notice_key; ?>"
  >
    <p>Welcome to <b><?php echo $plugin->title; ?></b>. Please see the <a href="<?php
      $url = (is_multisite() ? 'settings.php' : 'options-general.php')
        . "?page={$plugin->name}-settings&dismiss_admin_notice=true"
      ;
      echo esc_attr($url);
    ?>">plugin settings page</a> to get started.</p>
  </div>
  <?php

});
