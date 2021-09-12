
module.exports = {
	roots: ['<rootDir>/src/'],
	transform: {
		'^.+\\.svelte$': 'svelte-jester',
		'^.+\\.js$': 'babel-jest',
	},
	testEnvironment: 'jsdom',
	transformIgnorePatterns: ['node_modules'],
	moduleFileExtensions: ['js', 'svelte'],
	setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
}