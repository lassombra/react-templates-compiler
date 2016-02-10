compiler = Npm.require('react-templates');
//initialParse = /define\(\[(\s*\'[\w/]*\',{0,1})*\s*\],\s*function/mg;


function Compiler() {
};
Compiler.prototype.processFilesForTarget = function(files) {
    files.forEach(function (file) {
        var name = file.getDisplayPath();
        name = name.split('/').pop();
        name = name.split('.rt')[0];
        console.log(name);
        var compiled = compiler.convertTemplateToReact(file.getContentsAsString());
        var functionString = 'template'+name+' = ';
        var tokens = compiled.split('return');
        tokens.shift();
        compiled = tokens.join('return');
        tokens = compiled.split('});');
        tokens.pop();
        compiled = tokens.join('});');
        compiled = functionString + compiled;
        console.log(compiled);
        file.addJavaScript({data: compiled, path: file.getPathInPackage() + '.js'});
    });
};

ReactCompiler = Compiler;