/*
 * Deterministic mock media for the prototype — no network, no real media
 * library, no Openverse. Each item is:
 *
 *   image → { id, type: 'image', name, src }
 *   audio → { id, type: 'audio', name, hue }
 *
 * Each panel's images render their own bundled sample photo (so an item keeps
 * its image when moved between panels); `name` drives search + alt text, and the
 * audio `hue` tints its placeholder tile. Media Library and From the web carry
 * ~3× the images so their panels overflow and scroll.
 */

import pinnedPhoto from '../assets/pinned.jpg';
import libraryPhoto from '../assets/library.jpg';
import webPhoto from '../assets/web.jpg';

const GOLDEN_ANGLE = 137.508;

const IMAGE_NAMES = [
	'Sunset cliffs',
	'Forest path',
	'City rooftop',
	'Ocean waves',
	'Desert dunes',
	'Morning coffee',
	'Mountain lake',
	'Autumn leaves',
	'Studio portrait',
	'Neon signs',
	'Snowy peak',
	'Wildflowers',
	'Harbor at dawn',
	'Tropical leaves',
	'Night skyline',
];

function makeImages( prefix, count, src ) {
	return Array.from( { length: count }, ( _, i ) => {
		const base = IMAGE_NAMES[ i % IMAGE_NAMES.length ];
		const wrap = Math.floor( i / IMAGE_NAMES.length );
		return {
			id: `${ prefix }-img-${ i }`,
			type: 'image',
			name: wrap ? `${ base } ${ wrap + 1 }` : base,
			src,
		};
	} );
}

function makeAudio( prefix, names, hueSeed ) {
	return names.map( ( name, i ) => ( {
		id: `${ prefix }-audio-${ i }`,
		type: 'audio',
		name,
		hue: Math.round( ( hueSeed + i * GOLDEN_ANGLE ) % 360 ),
	} ) );
}

// --- Pinned: a small, curated set (8 images + 6 audio).
export const pinned = [
	...makeImages( 'pinned', 8, pinnedPhoto ),
	...makeAudio(
		'pinned',
		[
			'Intro loop',
			'Ambient pad',
			'Podcast clip',
			'Drum break',
			'Piano sketch',
			'Field recording',
		],
		200
	),
];

// --- Media Library: the whole library — many images (overflows) + audio.
export const library = [
	...makeImages( 'library', 36, libraryPhoto ),
	...makeAudio(
		'library',
		[
			'Acoustic riff',
			'Lo-fi beat',
			'Rain ambience',
			'Synth swell',
			'Bass groove',
			'Vinyl crackle',
			'Choir hum',
			'Tape loop',
			'Marimba motif',
		],
		260
	),
];

// --- From the web (Openverse-flavored, mock). Many images (overflows) + audio;
// shown one type at a time, images by default.
export const web = [
	...makeImages( 'web', 45, webPhoto ),
	...makeAudio(
		'web',
		[
			'Cinematic riser',
			'Forest birdsong',
			'Upbeat ukulele',
			'Deep drone',
			'Hand claps',
			'City traffic',
			'Gentle waves',
			'Jazz brushes',
			'Wind chimes',
		],
		320
	),
];
