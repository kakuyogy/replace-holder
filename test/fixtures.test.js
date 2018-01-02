const path = require('path');
const fs = require('fs');
const Promise = require('es6-promise');
const placeholder = require('../lib');
const rimraf = require('rimraf');

test('string', function () {
  const result = placeholder.string('i am ${{name}}', {
    name: 'replace-holder',
  });
  expect(result).toEqual('i am replace-holder');
});

test('file sync', function () {
  placeholder.fileSync(path.join(__dirname, 'fixtures/a.txt'), {
    name: 'replace-holder',
  }, __dirname)
  const contents = fs.readFileSync(path.join(__dirname, 'a.txt'), { encoding: 'utf8' });
  expect(contents).toEqual('i am replace-holder');
  rimraf.sync(path.join(__dirname, 'a.txt'))
}
);

test('file async', function () {
  return new Promise(function (resolve) {
    placeholder.file(path.join(__dirname, 'fixtures/a.txt'), {
      name: 'replace-holder',
    }, __dirname, function (err) {
      if (err) console.log(err);
      const contents = fs.readFileSync(path.join(__dirname, 'a.txt'), { encoding: 'utf8' });
      expect(contents).toEqual('i am replace-holder');
      rimraf.sync(path.join(__dirname, 'a.txt'))
      resolve();
    });
  });
});