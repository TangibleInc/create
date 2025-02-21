<?php

// Enqueue frontend styles and scripts

add_action('wp_enqueue_scripts', function() use ($plugin) {

  $url = $plugin->url;
  $version = $plugin->version;

  wp_enqueue_style(
    'example-plugin',
    $url . 'assets/build/example-plugin.min.css',
    [],
    $version
  );

  wp_enqueue_script(
    'example-plugin',
    $url . 'assets/build/example-plugin.min.js',
    ['jquery'],
    $version
  );

});
