import { expect, test } from 'vitest';
import { formatDate, cn, formatBytes, stripMD, urlHealer } from '../../src/lib/utils.js';

// formatDate
test('Date formatting', () => {
	const formattedDate = formatDate(new Date(2021, 0, 1));

	expect(formattedDate).toEqual('Jan 1, 2021');
});
test('Date formatting with custom style', () => {
	const formattedDate = formatDate(new Date(2021, 0, 1), 'full');

	expect(formattedDate).toEqual('Friday, January 1, 2021');
});
test('Date formatting with custom locale', () => {
	const formattedDate = formatDate(new Date(2021, 0, 1), 'full', 'fr');

	expect(formattedDate).toEqual('vendredi 1 janvier 2021');
});

// cn
test('Class name merging', () => {
	const classes = cn(
		'text-center',
		'text-blue-500',
		'font-bold',
		null,
		'text-xl',
		false,
		'text-neutral-400'
	);

	expect(classes).toEqual('text-center font-bold text-xl text-neutral-400');
});

// formatBytes
test('Byte to megabyte formatting', () => {
	const formattedBytes = formatBytes(1024 * 1024);

	expect(formattedBytes).toEqual('1 MB');
});
test('Byte to gigabyte formatting', () => {
	const formattedBytes = formatBytes(1024 * 1024 * 1024);

	expect(formattedBytes).toEqual('1 GB');
});
test('Byte to terabyte formatting', () => {
	const formattedBytes = formatBytes(1024 * 1024 * 1024 * 1024);

	expect(formattedBytes).toEqual('1 TB');
});
test('Byte to petabyte formatting', () => {
	const formattedBytes = formatBytes(1024 * 1024 * 1024 * 1024 * 1024);

	expect(formattedBytes).toEqual('1 PB');
});
test('Byte to 2.1MB formatting', () => {
	const formattedBytes = formatBytes(2.1 * 1024 * 1024);

	expect(formattedBytes).toEqual('2.1 MB');
});

// stripMD
test('Markdown stripping', () => {
	const strippedText = stripMD(`# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6

**Bold text**
__Bold text__
*Italic text*
_Italic text_

~~Strikethrough text~~

\`Inline code\`

[Link](https://example.com)
[Image](https://example.com/image.jpg)

---`);

	expect(strippedText).toEqual(`Header 1
Header 2
Header 3
Header 4
Header 5
Header 6

Bold text
Bold text
Italic text
Italic text

Strikethrough text

Inline code

Link
Image`);
});

// urlHealer
test('Separate slug and identifier', () => {
	const { id, slug } = urlHealer.identifier.separate('slug-text-23');

	expect(id).toEqual(23);
	expect(slug).toEqual('slug-text');
});
test('Join slug and identifier', () => {
	const url = urlHealer.identifier.join('slug-text', 23);

	expect(url).toEqual('slug-text-23');
});
