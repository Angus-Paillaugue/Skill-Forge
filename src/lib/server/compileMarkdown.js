import { compile } from 'mdsvex';
import highlighter from '$lib/codeHighlighter';

/**
 * Compiles the given Markdown string into HTML with syntax highlighting.
 *
 * @param {string} md - The Markdown string to compile.
 * @returns {Promise<string>} - A promise that resolves to the compiled HTML string.
 */
export default async function compileMarkdown(md) {
	const compiled = (
		await compile(md, {
			highlight: { highlighter }
		})
	).code
		.replace(/>{@html `<code class="language-/g, '><code class="language-')
		.replace(/<\/code>`}<\/pre>/g, '</code></pre>');
	return compiled;
}
