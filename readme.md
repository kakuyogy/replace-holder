## install
```sh
npm install --save replace-holder
```

## usage

### string
```js
import placeholder from 'replace-holder';
const result = placeholder.string('i am ${name}', {
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