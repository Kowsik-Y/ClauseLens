/** @type {import('cz-git').UserConfig} */

const fs = require('node:fs');
const path = require('node:path');
const apps = fs.readdirSync(path.resolve(__dirname, 'apps'));
const packages = fs.readdirSync(path.resolve(__dirname, 'packages'));

module.exports = {
	rules: {},
	prompt: {
		useEmoji: false,
		markBreakingChangeMode: true,
		scopes: ['root', ...apps, ...packages],
	},
};
