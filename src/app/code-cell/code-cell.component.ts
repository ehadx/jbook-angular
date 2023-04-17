import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { editor } from 'monaco-editor';
import * as prettier from 'prettier';
import * as parser from 'prettier/parser-babel';
import { EsbuildService } from '../bundler/esbuild.service';

const srcDoc = `
  <html>
    <head>
      <style>.error { color: red; }</style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message', (event) => {
          try {
            eval(event.data)
          } catch (err) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div class="error"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          }
        }, false);
      </script>
    </body>
  </html>
`;

const editorInitialValue = `\
import React from "react";
import { createRoot } from "react-dom";

const root = createRoot(document.querySelector("#root"));
root.render(<h1>Welcome to ng-jbook</h1>);\
`;

@Component({
  selector: 'app-code-cell',
  templateUrl: './code-cell.component.html',
  styleUrls: ['./code-cell.component.css']
})
export class CodeCellComponent {
  @ViewChild('codeCellContainer') codeCellContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('resizeHandle') resizeHandle!: ElementRef<HTMLDivElement>;
  @ViewChild('previewFrame') previewFrame!: ElementRef<HTMLIFrameElement>;

  html!: SafeHtml;
  userCodeForm = new FormGroup({
    input: new FormControl(editorInitialValue)
  });
  editorOptions: editor.IStandaloneEditorConstructionOptions = {
    language: 'javascript',
    autoIndent: 'full',
    theme: 'vs-dark',
    wordWrap: 'on',
    showUnused: false,
    folding: false,
    lineNumbersMinChars: 3,
    fontSize: 16,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    minimap: {
      enabled: false,
    },
  };

  constructor(
    private domSanitizer: DomSanitizer,
    private bundler: EsbuildService) {
  }

  onSubmit() {
    const input = this.userCodeForm.get('input')?.value || '';
    this.html = this.domSanitizer.bypassSecurityTrustHtml(srcDoc);
    this.bundler.build(input).subscribe(code => {
      this.previewFrame.nativeElement.contentWindow!.postMessage(code, '*');
    });
  }

  onFormat(event: MouseEvent) {
    event.preventDefault();
    const input = this.userCodeForm.get('input')?.value || '';
    this.userCodeForm.setValue({
      input: prettier.format(input, {
        parser: 'babel',
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      }).trimEnd()
    });
  }

  resizerState = {
    
  }

  initDrag(event: MouseEvent) {
    
  }
}
