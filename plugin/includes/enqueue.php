<?php

// Enqueue frontend styles and scripts

add_action('wp_enqueue_scripts', function() use ($plugin) {

  $url = $plugin->url;
  $version = $plugin->version;

  wp_enqueue_style(
    'project-name',
    $url . 'assets/build/project-name.min.css',
    [],
    $version
  );

  wp_enqueue_script(
    'project-name',
    $url . 'assets/build/project-name.min.js',
    ['jquery'],
    $version
  );

});
