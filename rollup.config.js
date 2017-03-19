import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'index.ts',
  dest: 'bundles/oidc-angular2-client.umd.js',
  format: 'umd',
  sourceMap: true,
  moduleName: 'oidcangular2client',
  plugins: [
    typescript()
  ],
  // This is how you exclude code from the bundle
    external: [
    '@angular/core',
    '@angular/common',
    '@angular/compiler',
    '@angular/core',
    '@angular/http',
    '@angular/platform-browser',
    '@angular/platform-browser-dynamic',
    '@angular/router',
    '@angular/router-deprecated',
    'rxjs/Observable'
  ],
  globals: {
    '@angular/core': 'oidcangular2client.core',
    '@angular/http': 'oidcangular2client.http',
    '@angular/router': 'oidcangular2client.router',
    'rxjs/Observable': 'Rx'
  }
}