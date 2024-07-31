export default {
  build: [
    {
      src: 'src/index.html',
      dest: 'build'
    },
    {
      src: 'src/index.js',
      dest: 'build/index.min.js'
    },
    {
      src: 'src/index.scss',
      dest: 'build/index.min.css'
    },
  ],
  format: [
    'src'
  ],
  serve: {
    dir: 'build',
    port: 3000
  }
}
