var fs = require('fs');
var path = require('path');
var colors = require('colors');
var argv = require('minimist')(process.argv.slice(2));

// ----------------------------------------------------------------------------
// Some consts à la C
// ----------------------------------------------------------------------------

var PREFIX_FOLDER = '- '; 
var PREFIX_FILE   = '· '; // should have the same size as PREFIX_FOLDER
var DEFAULT_IGNORED_PATTERN = /^\./;

// ----------------------------------------------------------------------------
// chtree --help
// ----------------------------------------------------------------------------
if (argv.help) {
  console.log('chtree [directory] [--no-colors] [--ignore regexp]');
  process.exit(0);
}

// ----------------------------------------------------------------------------
// chtree [directory]
// ----------------------------------------------------------------------------
var baseDirectory = '.';
if (argv._.length > 0) {
  baseDirectory = argv._[0];
}


// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

// REPEAT REPEAT REPEAT REPEAT REPEAT REPEAT REPEAT REPEAT
function repeat(c, times) {
    var str = '';
    while (times--) {
        str += c;
    }
    return str;
}

// returns true if the name matches the ignore pattern
function isIgnored(name) {
  if (argv.ignore) {
    return name.match(new RegExp(argv.ignore));
  }
  return name.match(DEFAULT_IGNORED_PATTERN);
}

// returns the name colorized according to its extension (hardcoded for the moment)
function colorize(name) {
    // --colors non set?
    if (argv['colors'] === false) {
      return name;
    }

    // js[x] green
    if (name.match(/\.js[x]?$/)) {
      name = name.green;
    }

    // json gray
    if (name.match(/\.json?$/)) {
      name = name.gray;
    }

    return name;
}

// ----------------------------------------------------------------------------
// Main recursive function.
// ----------------------------------------------------------------------------
function walk(fromDir, fileCallback, enterDirectoryCallback, exitDirectoryCallback) {
    var filesInDir = fs.readdirSync(fromDir);

    var dirs = [];
    var files = [];

    // first, get all the files non ignored and push them into 2 different structures
    // according to their type (folder or file)
    for (var i = 0, l = filesInDir.length; i < l; i++) {
      var name = filesInDir[i];
      if (isIgnored(name)) continue;

      var abspath = path.join(fromDir, name);
      var stat = fs.statSync(abspath);
      var obj = { path: abspath, name: name, stat: stat };

      if (stat.isDirectory()) {
        dirs.push(obj);
      } else {
        files.push(obj);
      }
    }

    // loop through folders first (for the tree to display them first)
    // and recursive call walk()
    for (var i = 0, l = dirs.length; i < l; i++) {
      var d = dirs[i];
      enterDirectoryCallback && enterDirectoryCallback(d.path, d.name, d.stat);
      walk(d.path, fileCallback, enterDirectoryCallback, exitDirectoryCallback);
      exitDirectoryCallback && exitDirectoryCallback(d.path, d.name, d.stat);
    }

    // then loop through the files
    for (var i = 0, l = files.length; i < l; i++) {
      var f = files[i];
      fileCallback && fileCallback(f.path, f.name, f.stat);
    }    
}


// ----------------------------------------------------------------------------
// Define callbacks to render the tree when walking
// ----------------------------------------------------------------------------
var currentDepth = 0;
var willNeedSpace = false;

var fileCallback = function(path, fileName, stat) {
    willNeedSpace = true;
    fileName = colorize(fileName);
    console.log(repeat('  ', currentDepth) + PREFIX_FILE + fileName);
};

var enterDirectoryCallback = function(path, folderName, stat) {
    willNeedSpace = true;
    console.log(repeat('  ', currentDepth) + PREFIX_FOLDER + folderName);
    currentDepth++;
};

var exitDirectoryCallback = function() {
    // we display a blank line below leafs but only one (if multiple leafs)
    currentDepth--;
    if (willNeedSpace) {
      console.log();
      willNeedSpace = false;
    }
};

// ----------------------------------------------------------------------------
// GO GO GO
// ----------------------------------------------------------------------------
walk(baseDirectory, fileCallback, enterDirectoryCallback, exitDirectoryCallback);
