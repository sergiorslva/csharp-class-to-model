"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "csharp-class-to-model" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('csharp-class-to-model.csharptots', () => {
        // The code you place here will be executed every time your command is executed
        vscode.env.clipboard.readText().then((text) => {
            const position = new vscode.Position(0, 0);
            const wsedit = new vscode.WorkspaceEdit();
            const newModel = replaceClassProperties(text);
            if (vscode.window.activeTextEditor) {
                const uri = vscode.window.activeTextEditor.document.uri;
                wsedit.insert(uri, position, newModel);
                vscode.workspace.applyEdit(wsedit);
            }
        });
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function replaceClassProperties(clipboardText) {
    const splitted = clipboardText.split("\n");
    let newContent = '';
    for (const line of splitted) {
        const firstKeyPosition = line.indexOf('{');
        const lastKeyPosition = line.indexOf('}');
        if (line.indexOf('class') > 0) {
            newContent = line.replace('public', 'export').replace('\r', ' {') + '\n';
        }
        if (firstKeyPosition > 0 && lastKeyPosition > 0) {
            let newLine = line.substr(0, firstKeyPosition);
            newLine = newLine.replace('?', '');
            if (newLine.indexOf('int') > 0) {
                newLine = newLine.replace('int', '');
                newLine = `${newLine}: number;`;
            }
            else if (newLine.indexOf('DateTime') > 0) {
                newLine = newLine.replace('DateTime', '');
                newLine = `${newLine}: Date;`;
            }
            else if (newLine.indexOf('double') > 0) {
                newLine = newLine.replace('double', '');
                newLine = `${newLine}: number;`;
            }
            else if (newLine.indexOf('Double') > 0) {
                newLine = newLine.replace('Double', '');
                newLine = `${newLine}: number;`;
            }
            else if (newLine.indexOf('Decimal') > 0) {
                newLine = newLine.replace('Decimal', '');
                newLine = `${newLine}: number;`;
            }
            else if (newLine.indexOf('decimal') > 0) {
                newLine = newLine.replace('decimal', '');
                newLine = `${newLine}: number;`;
            }
            else if (newLine.indexOf('float') > 0) {
                newLine = newLine.replace('float', '');
                newLine = `${newLine}: number;`;
            }
            else if (newLine.indexOf('string') > 0) {
                newLine = newLine.replace('string', '');
                newLine = `${newLine}: string;`;
            }
            else if (newLine.indexOf('String') > 0) {
                newLine = newLine.replace('String', '');
                newLine = `${newLine}: string;`;
            }
            else if (newLine.indexOf('<') > 0) {
                const indexOfOpen = newLine.indexOf('<');
                const indexOfClose = newLine.indexOf('>');
                const className = newLine.substr(indexOfOpen + 1, (indexOfClose - indexOfOpen) - 1);
                const propName = newLine.substr(indexOfClose + 1, firstKeyPosition);
                newLine = `public ${propName}: Array<${className}>;`;
            }
            newContent += newLine + '\n';
        }
    }
    return `${newContent}\n}`;
}
//# sourceMappingURL=extension.js.map