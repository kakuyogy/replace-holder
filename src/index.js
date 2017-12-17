import fs from 'fs';
import path from 'path';
import glob from 'glob';
import vfs from 'vinyl-fs';
import through from 'through2';

import {is} from './util';

const PLACEHOLDER = /\$\{(.+?)\}/g;
const noop = () => {};
export function file(source, placeholders, dest = process.cwd(), cb = noop) {
  if(is.function(dest)) {
    cb = dest;
    dest = process.cwd();
  }
  vfs.src(source)
  .pipe(through.obj(function(f, enc, cb) {
    f.contents = new Buffer(replaceholder(f.contents.toString(), placeholders));
    cb(null, f);
  }))
  .pipe(vfs.dest(dest))
  .on('finish', () => {
    cb();
  })
  .on('error', (err) =>{
    cb(err);
  });
}

export function fileSync(source, placeholders, dest = process.cwd()) {
  const filePaths = glob.sync(source);
  filePaths.forEach((filePath) => {
    const filename = path.basename(filePath);
    const contents = fs.readFileSync(filePath, {encoding: 'utf8'});
    fs.writeFileSync(path.join(dest, filename), replaceholder(contents, placeholders));
  });
}

export function string(str, placeholders) {
  return replaceholder(str, placeholders);
}

function replaceholder(str, placeholders) {
  return str.replace(PLACEHOLDER, function(_, matched) {
    return getPlaceholder(matched, placeholders);
  });
}

function getPlaceholder(matched, placeholders) {
  const value = placeholders[matched];
  if(is.undef(value)) {
    warning(matched, 'undefined');
    return '';
  }
  if(is.function(value)) {
    return value(matched);
  } else if(is.string(value)) {
    return value;
  } else if(is.number(value)) {
    return '' + value;
  } else {
    warning(matched, 'unknown type');
    return '';
  }

}

export function warning(matched, type) {
  // eslint-disable-next-line
  console.log(`warning: placeholder ${matched}'s value is ${type}, null character string '' will be replaced`);
}