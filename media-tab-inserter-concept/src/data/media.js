/*
 * Deterministic mock media for the prototype — no network, no real media
 * library, no Openverse. Each item is:
 *
 *   { id, type: 'image' | 'audio', name, hue }
 *
 * `hue` (0–360) drives the placeholder gradient (see MediaThumb); `name` drives
 * search matching, image alt text, and the audio caption. Hues are spaced by the
 * golden angle so adjacent tiles always look distinct.
 */

let nextId = 0;
const GOLDEN_ANGLE = 137.508;

function makeItems( type, names, hueSeed ) {
	return names.map( ( name, i ) => ( {
		id: `${ type }-${ nextId++ }`,
		type,
		name,
		hue: Math.round( ( hueSeed + i * GOLDEN_ANGLE ) % 360 ),
	} ) );
}

// --- Pinned: a small, curated set (matches the wireframe's 8 images + 6 audio).
export const pinned = [
	...makeItems(
		'image',
		[
			'Sunset cliffs',
			'Forest path',
			'City rooftop',
			'Ocean waves',
			'Desert dunes',
			'Morning coffee',
			'Mountain lake',
			'Autumn leaves',
		],
		12
	),
	...makeItems(
		'audio',
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

// --- Media Library: the whole library — a larger set of both types.
export const library = [
	...makeItems(
		'image',
		[
			'Studio portrait',
			'Neon signs',
			'Snowy peak',
			'Wildflowers',
			'Old bookshop',
			'Harbor at dawn',
			'Concrete stairs',
			'Tropical leaves',
			'Vintage car',
			'Latte art',
			'Rolling hills',
			'Night skyline',
		],
		40
	),
	...makeItems(
		'audio',
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

// --- From the web (Openverse-flavored, mock). Filtered to one type at a time;
// images are shown by default before any search.
export const web = [
	...makeItems(
		'image',
		[
			'Aerial coastline',
			'Misty redwoods',
			'Market stall',
			'Glass facade',
			'Sand patterns',
			'Lavender field',
			'Street mural',
			'Frozen lake',
			'Canyon light',
			'Paper textures',
			'Cherry blossom',
			'Subway tunnel',
			'Golden wheat',
			'Coral reef',
			'Mountain fog',
		],
		80
	),
	...makeItems(
		'audio',
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
