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
    ]
  ],
]);
