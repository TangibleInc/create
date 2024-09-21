export default {
  build: [
    // Frontend - See includes/enqueue.php

    // {
    //   src: 'assets/src/index.js',
    //   dest: 'assets/build/project-name.min.js'
    // },
    {
      src: 'assets/src/index.scss',
      dest: 'assets/build/project-name.min.css',
    },
  ],
  format: ['**/*.{php,js,json,scss}', '!assets/build', '!vendor'],
  install: [
    {
      git: 'git@github.com:tangibleinc/framework',
      branch: 'main',
      dest: 'vendor/tangible/framework',
    },
    {
      git: 'git@github.com:tangibleinc/plugin-updater',
      branch: 'main',
      dest: 'vendor/tangible/plugin-updater',
    },
  ],
}
