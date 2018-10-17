module.exports = [
  {
    name: 'application',
    dependencies: [
      'vendor/jquery',
      '~lodash/lodash'
    ],
    files: [
      'components/hello',
      'components/world'
    ]
  },
  {
    name: 'blog',
    files: [
      'components/hello'
    ]
  }
]
