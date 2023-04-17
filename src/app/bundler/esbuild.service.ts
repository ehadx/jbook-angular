import { Injectable } from '@angular/core';
import * as esbuild from 'esbuild-wasm/esm/browser';
import { from, map } from 'rxjs';
import { fetchPlugin } from './fetch-plugin';
import { unpkgPathPlugin } from './unpkg-path-plugin';

@Injectable({
  providedIn: 'root',
})
export class EsbuildService {

  constructor() {
    this.initialize();
  }

  build(rawInput: string) {
    return from(esbuild.build({
      entryPoints: ['index.js'],
      target: "es2015",
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawInput)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    })).pipe(
      map(result => result.outputFiles[0].text)
    );
  }

  private async initialize() {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.16.17/esbuild.wasm',
    });
  }
}
