const path = require('path');
const fs = require('fs');
const Promise = require('es6-promise');
const placeholder = require('../lib/index.js');
const rimraf = require('rimraf');

const source = path.join(__dirname, 'fixtures/demo/**')
const dest = path.join(__dirname, 'target');
const packageJson = path.join(dest, 'package.json');

test('demo file sync', function () {
  placeholder.fileSync(source, {
    projName: 'legoProj',
  }, dest, { ignoreBase: ['jpeg'] })
  const expected = require(packageJson).name;
  expect(expected).toEqual('legoProj');
  rimraf.sync(dest)
}
);

test('demo file async', function () {
  return new Promise(function (resolve) {
    placeholder.file(source, {
      projName: 'legoProj',
    }, dest, { ignoreBase: ['jpeg'] }, function (err) {
      if (err) console.log(err);
      const expected = require(packageJson).name;
      expect(expected).toEqual('legoProj');
      rimraf.sync(dest)
      resolve();
    });
  });
});