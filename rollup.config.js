export default {
	entry: 'dist/index.js',
	dest: 'dist/bundles/npm-module-file-upload.umd.js',
	sourceMap: false,
	format: 'umd',
	moduleName: 'ng.npm-module-file-upload',
	globals: {
		'@angular/core': 'ng.core',
		'@angular/common': 'ng.common'
	}
}
