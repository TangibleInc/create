<?php
namespace tests\example_plugin;

class Basic_TestCase extends \WP_UnitTestCase {
  function test_plugin_function() {
    $this->assertTrue( function_exists( 'example_plugin' ) );
  }
}
