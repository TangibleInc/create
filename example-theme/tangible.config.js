export default {
  build: [
    // Frontend - See includes/enqueue.php

    // {
    //   src: 'assets/src/index.js',
    //   dest: 'assets/build/example-theme.min.js'
    // },
    {
      src: 'assets/src/index.scss',
      dest: 'assets/build/example-theme.min.css',
    },
  ],
  format: [
    'assets/src',
    'includes',
    '*.{php,js,json}'
  ],
  archive: {
    root: 'example-theme',
    src: [
      '*.php',
      '*.css',
      'theme.json',
      'assets/**',
      'includes/**',
      'parts/**',
      'styles/**',
      'templates/**',
      'vendor/tangible/**',
      'readme.*'
    ],
    dest: 'publish/example-theme.zip',
    exclude: [
      'assets/src',
      'docs',
      'vendor/tangible/*/vendor',
      'vendor/tangible-dev/',
      '.git',
      '**/artifacts',
      '**/publish',
      '**/node_modules',
      '**/tests',
      '**/*.scss',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx',
    ],
  },
  /**
   * Dependencies for production are installed in `vendor/tangible`, which is included
   * in the published zip package. Those for development are in `tangible-dev`, which
   * is excluded from the archive.
   * 
   * In the file `.wp-env.json`, these folders are mounted to the virtual file system
   * for local development and testing.
   */
  install: [
    {
      git: 'git@github.com:tangibleinc/framework',
      dest: 'vendor/tangible/framework',
      branch: 'main',
    },
    {
      git: 'git@github.com:tangibleinc/updater',
      branch: 'main',
      dest: 'vendor/tangible/updater'
    },
  ],
  installDev: [
    // {
    //   zip: 'https://downloads.wordpress.org/plugin/example.latest-stable.zip',
    //   dest: 'vendor/tangible-dev/example-zip'
    // },
    // {
    //   git: 'git@github.com:tangibleinc/example',
    //   dest: 'vendor/tangible-dev/example-git',
    //   branch: 'main',
    // },
  ]
}
