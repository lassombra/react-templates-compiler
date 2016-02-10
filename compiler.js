var compiler = Npm.require('react-templates');
var defineRegex = /define\(\[(\s*\'[\w\/]*\',?)*\s*\], function/mg;
var commentRegex = /<!--.*-->/mg;
var nameRegex = /name="(.*)"/mg;

function Compiler() {
};
Compiler.prototype.processFilesForTarget = function(files) {
    files.forEach(function (file) {
        var contents = file.getContentsAsString();
        var displayName = file.getDisplayPath();
        var name = getFunctionName(displayName, contents);
        var compiled = createIIFE(contents, name);
        file.addJavaScript({data: compiled, path: file.getPathInPackage() + '.js'});
    });
};

function toCamelCase(name) {
    var tokens = name.split(/\W+/g);
    var first = tokens.shift();
    tokens = tokens.map(function (token) {
        return token.charAt(0).toUpperCase() + token.slice(1);
    });
    tokens.unshift(first);
    return tokens.join('');
}

function getFunctionName(displayName, contents) {
    var name = displayName;
    name = name.split('/').pop();
    name = name.split('.rt')[0];
    var comment = commentRegex.exec(contents);
    comment = comment && comment[0];
    if (comment) {
        var tempName = nameRegex.exec(comment);
        tempName = tempName && tempName[1];
        if (tempName) {
            name = tempName;
        }
    }
    return toCamelCase(name);
}

function createIIFE(contents, name) {
    var compiled = compiler.convertTemplateToReact(contents);
    compiled = compiled.replace(defineRegex, name + ' = (function');
    compiled = compiled.slice(0, compiled.length - 2);
    compiled += ')(React, _);';
    return compiled;
}

ReactCompiler = Compiler;