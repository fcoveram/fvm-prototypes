import { useLayoutEffect, useRef, useState } from 'react';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import worldTopo from 'world-atlas/countries-110m.json';

// "Builder-defined" content for the example widget — a top-locations report. It responds to
// the size context (tier + measured height), following the Figma "Full responsive widget":
//   Micro   -> total-views stat
//   Small   -> list of countries + numbers
//   Medium  -> list of countries + numbers + "change" numbers
//   Large   -> the list  +  a bar graph
//   Full    -> the list  +  a bar graph  +  a world map
// All data is dumb and static. The list fills its area; the bars show only the first 6.
const POOL = [
	{ name: 'United States', code: 'US', views: 4820, change: 12 },
	{ name: 'Germany', code: 'DE', views: 2110, change: 4 },
	{ name: 'United Kingdom', code: 'UK', views: 1760, change: -2 },
	{ name: 'France', code: 'FR', views: 1240, change: 8 },
	{ name: 'Canada', code: 'CA', views: 980, change: 1 },
	{ name: 'Japan', code: 'JP', views: 720, change: 15 },
	{ name: 'Brazil', code: 'BR', views: 540, change: -5 },
	{ name: 'India', code: 'IN', views: 510, change: 22 },
	{ name: 'Australia', code: 'AU', views: 470, change: 6 },
	{ name: 'Spain', code: 'ES', views: 430, change: -3 },
	{ name: 'Italy', code: 'IT', views: 400, change: 9 },
	{ name: 'Netherlands', code: 'NL', views: 360, change: 2 },
	{ name: 'Mexico', code: 'MX', views: 330, change: 11 },
	{ name: 'Sweden', code: 'SE', views: 300, change: -1 },
	{ name: 'Poland', code: 'PL', views: 280, change: 7 },
	{ name: 'Turkey', code: 'TR', views: 255, change: 14 },
	{ name: 'Indonesia', code: 'ID', views: 230, change: 18 },
	{ name: 'South Korea', code: 'KR', views: 210, change: 3 },
	{ name: 'Argentina', code: 'AR', views: 190, change: -4 },
	{ name: 'South Africa', code: 'ZA', views: 170, change: 5 },
	{ name: 'Norway', code: 'NO', views: 150, change: 1 },
	{ name: 'Belgium', code: 'BE', views: 135, change: -2 },
	{ name: 'Portugal', code: 'PT', views: 120, change: 10 },
	{ name: 'Ireland', code: 'IE', views: 110, change: 6 },
];
const TOTAL = POOL.reduce( ( sum, l ) => sum + l.views, 0 );

// Approx. height of one list row (line height + the list's row gap), used to compute how
// many rows fill the available area.
const ROW_STRIDE = 27;

// World map, precomputed once. Real country geometry (Natural Earth, public-domain, via
// world-atlas) projected with d3-geo's Equal Earth projection and fitted to the viewBox, so
// it renders as a realistic, proportionally-scaling vector map. Purely decorative — it has
// no connection to the widget's data.
const MAP_W = 400;
const MAP_H = 200;
const COUNTRIES = feature( worldTopo, worldTopo.objects.countries );
const MAP_PROJECTION = geoEqualEarth().fitSize( [ MAP_W, MAP_H ], COUNTRIES );
const MAP_PATHS = COUNTRIES.features
	.map( ( f ) => geoPath( MAP_PROJECTION )( f ) )
	.filter( Boolean );

const fmt = ( n ) => n.toLocaleString( 'en-US' );

export default function WidgetContent( { tier } ) {
	// Micro is a glanceable unit: a single number, centered.
	if ( tier.key === 'micro' ) {
		return (
			<div className="wc-stat">
				<div className="wc-stat__num">{ fmt( TOTAL ) }</div>
				<div className="wc-stat__label">Total views</div>
			</div>
		);
	}

	if ( tier.key === 'small' ) {
		return (
			<div className="wc">
				<CountryList showChange={ false } />
			</div>
		);
	}

	if ( tier.key === 'medium' ) {
		return (
			<div className="wc">
				<CountryList showChange />
			</div>
		);
	}

	// Large and Full add columns alongside the list.
	return (
		<div className="wc wc--cols">
			<div className="wc__col">
				<CountryList showChange />
			</div>
			<div className="wc__col">
				<BarsGraph />
			</div>
			{ tier.key === 'full' && (
				<div className="wc__col">
					<WorldMap />
				</div>
			) }
		</div>
	);
}

// Fills its area with as many rows as fit, recomputed as the widget is resized. The data
// just cycles through POOL — it need not be coherent with the bars/map.
function CountryList( { showChange } ) {
	const ref = useRef( null );
	const [ count, setCount ] = useState( 6 );

	useLayoutEffect( () => {
		const el = ref.current;
		if ( ! el ) return;
		const measure = () =>
			setCount( Math.max( 1, Math.ceil( el.clientHeight / ROW_STRIDE ) ) );
		measure();
		const observer = new ResizeObserver( measure );
		observer.observe( el );
		return () => observer.disconnect();
	}, [] );

	return (
		<ul className="wc-list" ref={ ref }>
			{ Array.from( { length: count }, ( _, i ) => {
				const loc = POOL[ i % POOL.length ];
				return (
					<li className="wc-row" key={ i }>
						<span className="wc-row__name">{ loc.name }</span>
						<span className="wc-row__views">{ fmt( loc.views ) }</span>
						{ showChange && (
							<span
								className={ `wc-row__chg ${ loc.change >= 0 ? 'is-up' : 'is-down' }` }
							>
								{ loc.change >= 0 ? '+' : '−' }
								{ Math.abs( loc.change ) }%
							</span>
						) }
					</li>
				);
			} ) }
		</ul>
	);
}

// Only the first 6 items of the list.
function BarsGraph() {
	const items = POOL.slice( 0, 6 );
	const max = Math.max( ...items.map( ( i ) => i.views ) );
	return (
		<div className="wc-bars" aria-hidden="true">
			{ items.map( ( i ) => (
				<div className="wc-bars__col" key={ i.code } title={ `${ i.name }: ${ fmt( i.views ) }` }>
					<div className="wc-bars__track">
						<div
							className="wc-bars__bar"
							style={ { height: `${ Math.round( ( i.views / max ) * 100 ) }%` } }
						/>
					</div>
					<div className="wc-bars__code">{ i.code }</div>
				</div>
			) ) }
		</div>
	);
}

function WorldMap() {
	return (
		<div className="wc-map" role="img" aria-label="World map">
			<svg
				className="wc-map__svg"
				viewBox={ `0 0 ${ MAP_W } ${ MAP_H }` }
				preserveAspectRatio="xMidYMid meet"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g className="wc-map__land">
					{ MAP_PATHS.map( ( d, i ) => (
						<path key={ i } d={ d } />
					) ) }
				</g>
			</svg>
		</div>
	);
}
