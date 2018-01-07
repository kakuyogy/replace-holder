import fs from 'fs';
import path from 'path';
import glob from 'glob';
import globBase from 'glob-base';
import vfs from 'vinyl-fs';
import through from 'through2';
import mkdirp from 'mkdirp';

import { is } from './util';

const PLACEHOLDER = /\$\{\{(.+?)\}\}/g;
const noop = () => { };
const GLOB_OPTIONS = {
  realPath: true,
  nodir: true,
  dot: true,
};

export function file(source, placeholders, dest = process.cwd(), options = {}, cb = noop) {
  if (is.function(dest)) {
    cb = dest;
    dest = process.cwd();
    options = {};
  } else if (is.function(options)) {
    cb = options;
    options = {};
  }
  const isIgnore = getIgnore(options);
  vfs.src(source, GLOB_OPTIONS)
    .pipe(through.obj(function (f, enc, cb) {
      !isIgnore(f.path) && (f.contents = new Buffer(replaceholder(f.contents.toString(), placeholders)));
      cb(null, f);
    }))
    .pipe(vfs.dest(dest))
    .on('finish', () => {
      cb();
    })
    .on('error', (err) => {
      cb(err);
    });
}

export function fileSync(source, placeholders, dest = process.cwd(), options = {}) {
  const isIgnore = getIgnore(options);
  const filePaths = glob.sync(source, GLOB_OPTIONS);
  const base = globBase(source).base;
  filePaths.forEach((filePath) => {
    const destFilePath = path.resolve(dest, path.relative(base, filePath));
    const destFileDir = path.dirname(destFilePath);
    !fs.existsSync(destFileDir) && mkdirp.sync(destFileDir);
    let contents = fs.readFileSync(filePath);
    if (!isIgnore(filePath)) {
      contents = new Buffer(contents).toString();
      contents = replaceholder(contents, placeholders);
    }
    fs.writeFileSync(destFilePath, new Buffer(contents));
  });
}

export function string(str, placeholders) {
  return replaceholder(str, placeholders);
}

function replaceholder(str, placeholders) {
  return str.replace(PLACEHOLDER, function (_, matched) {
    return getPlaceholder(matched, placeholders);
  });
}

function getPlaceholder(matched, placeholders) {
  const value = placeholders[matched];
  if (is.undef(value)) {
    warning(matched, 'undefined');
    return '';
  }
  if (is.function(value)) {
    return value(matched);
  } else if (is.string(value)) {
    return value;
  } else if (is.number(value)) {
    return '' + value;
  } else {
    warning(matched, 'unknown type');
    return '';
  }
}

function getIgnore(options) {
  const {
    ignoreBase,  // ['png', 'svg']
    ignorePattern,  // glob
  } = options;

  const noIgnore = !ignoreBase && !ignorePattern;
  return function (filePath) {
    if (noIgnore) {
      return false;
    } else {
      if (ignoreBase && ignoreBase.length) {
        const ext = path.extname(filePath);
        const notDotExt = ext.substr(1);
        if (ignoreBase.indexOf(notDotExt) > -1) {
          return true;
        } else if (ignoreBase.indexOf(ext) > -1) {
          return true;
        }
      }

      if (ignorePattern) {
        const ignoreFiles = glob.sync(ignorePattern, {
          realPath: true,
          nodir: true,
        });
        if (ignoreFiles.indexOf(filePath) > -1) {
          return true;
        }
      }
      return false;
    }
  };
}

export default {
  string,
  file,
  fileSync,
};

function warning(matched, type) {
  // eslint-disable-next-line
  console.log(`warning: placeholder ${matched}'s value is ${type}, null character string '' will be replaced`);
}