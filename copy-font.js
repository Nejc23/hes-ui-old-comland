var copydir = require('copy-dir');

copydir.sync('./node_modules/npm-font-open-sans/fonts/', './src/assets/fonts/open-sans');
copydir.sync('./node_modules/@fortawesome/fontawesome-free/webfonts', './src/assets/fonts/font-awesome');
