## install
```sh
npm install --save replace-holder
```

## test
```sh
npm run test
```

## usage

${{`replace-holder`}}

### string
```js
import placeholder from 'replace-holder';
const result = placeholder.string('i am ${{name}}', {
  name: 'replace-holder',
});
```

### file async
```js
import placeholder from 'replace-holder';
placeholder.file(path.join(__dirname, 'fixtures/a.txt'), {
  name: 'replace-holder',
}, __dirname, function (err) {
  if (err) console.log(err);
  const contents = fs.readFileSync(path.join(__dirname, 'a.txt'), { encoding: 'utf8' });
});
```

### file sync
```js
import placeholder from 'replace-holder';
placeholder.fileSync(path.join(__dirname, 'fixtures/a.txt'), {
  name: 'replace-holder',
}, __dirname);
const contents = fs.readFileSync(path.join(__dirname, 'a.txt'), { encoding: 'utf8' });
```

### dir sync
```js
import placeholder from 'replace-holder';
const source = path.join(__dirname, 'fixtures/demo/**');
const dest = path.join(__dirname, 'target');
placeholder.fileSync(source, {
    projName: 'legoProj',
  }, dest, { ignoreBase: ['png'] });
```

### dir async
```js
import placeholder from 'replace-holder';
const source = path.join(__dirname, 'fixtures/demo/**');
const dest = path.join(__dirname, 'target');
placeholder.file(source, {
    projName: 'legoProj',
  }, dest, { ignoreBase: ['png'] }, function (err) {
    if (err) console.log(err);
  });
```