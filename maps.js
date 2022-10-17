let zIndex = 99;

async function initMap() {
	const map = new google.maps.Map(document.getElementById('map'), {
		mapId: 'c905ad459d6961a8',
		zoom: 12,
		center: { lat: -23.5406, lng: -46.6321 },
		zoomControl: true,
		mapTypeControl: false,
		scaleControl: true,
		streetViewControl: true,
		rotateControl: false,
		fullscreenControl: true,
	});
	const infoWindow = new google.maps.InfoWindow({ content: '', disableAutoPan: true });
	let listings;

	try {
		const response = await fetch(
			`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/listings`,
			{ method: 'GET' }
		);

		if (response.status !== 200)
			throw new Error('Não foi possível recuperar dados de imóveis. Tente novamente mais tarde.');

		listings = await response.json();
	} catch (error) {
		return alert(
			error.display && error.message
				? error.message
				: 'Não foi possível recuperar dados de imóveis. Tente novamente mais tarde.'
		);
	}

	// NOTE Add markers to the map
	const markers = listings.map((listing) => {
		if (Array.isArray(listing.location) && listing.location.length && listing.price) {
			const marker = new google.maps.Marker({
				position: listing.location,
				icon: 'https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/634a1c5e5cb8ac328de736c5_marker-bg.svg',
				label: { text: listing.price, className: 'marker-label' },
			});

			// NOTE Open info window when marker is clicked
			if (isTouchDevice()) {
				marker.addListener('click', () => displayCard(marker, infoWindow));
			} else {
				marker.addListener('mouseover', () => displayCard(marker, infoWindow));
			}

			// NOTE Close
			marker.addListener('mouseout', () => {
				const label = marker.getLabel();
				label.color = 'black';
				marker.setLabel(label);
				if (infoWindow) infoWindow.close();
			});

			return marker;
		}
	});

	// NOTE When map is clicked
	google.maps.event.addListener(map, 'click', function () {
		if (infoWindow) infoWindow.close();
	});

	// NOTE Cluster marker
	const renderer = {
		render: function ({ count, position }) {
			const svg = window.btoa(
				`<svg fill="#3782FF" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><circle cx="120" cy="120" opacity=".9" r="70" /></svg>`
			);

			// NOTE Create marker using svg icon
			return new google.maps.Marker({
				position,
				icon: { url: `data:image/svg+xml;base64,${svg}`, scaledSize: new google.maps.Size(75, 75) },
				label: {
					text: String(count),
					color: 'rgba(255,255,255,0.9)',
					fontSize: '14px',
					fontWeight: 'bold',
				},
				zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
			});
		},
	};

	// NOTE Add a marker clusterer to manage the markers.
	new markerClusterer.MarkerClusterer({ map, markers, renderer });
}

window.initMap = initMap;

// NOTE Support functions
function displayCard(marker, infoWindow) {
	const contentString =
		'<div class="listing-card maps"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62cdd6804af009702c397856_placeholder.png" loading="lazy" width="320" height="180" sizes="320px" srcset="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62cdd6804af009702c397856_placeholder-p-500.png 500w, https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62cdd6804af009702c397856_placeholder.png 600w" alt="" class="listing-thumbnail maps"><div class="listing-data maps"><div class="property-features maps"><div class="listing-price maps">R$ 100.000.000</div><div class="property-type maps">Apartamento</div></div><div class="property-address maps"><div class="address truncate maps">Rua This is some text inside of </div></div><div class="property-overview maps"><div class="icon-wrapper maps"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/63499bb335d9db97a070b68d_area-dark.svg" loading="lazy" width="24" alt="" class="card-icon maps"><div class="card-icon-text maps">1200 m2</div></div><div class="icon-wrapper maps"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62c9ae5e4f9abc652cde4a10_bed.svg" loading="lazy" width="24" alt="" class="card-icon maps"><div class="card-icon-text maps">10</div></div><div class="icon-wrapper maps"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62c9ae5ee45b2d182f9cf895_shower.svg" loading="lazy" width="24" alt="" class="card-icon maps"><div class="card-icon-text maps">10</div></div><div class="icon-wrapper maps"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62c9ae5e7c26b50c463fd35e_car.svg" loading="lazy" width="24" alt="" class="card-icon maps"><div class="card-icon-text maps">10</div></div></div></div></div>';

	// NOTE Update color and zIndex
	const label = marker.getLabel();
	label.color = '#3782FF';
	marker.setLabel(label);
	marker.setZIndex(zIndex + 1);
	zIndex += 1;

	infoWindow.setContent(contentString);
	infoWindow.open({ anchor: marker, map, shouldFocus: false });
}

function isTouchDevice() {
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

function toggleMap() {
	if ($('#listings-list').is(':visible')) {
		$('#listings-list').hide();
		$('.list-properties').hide();
		$('#google-maps').show();
		$('.listing-options').css('justify-content', 'space-evenly');
		$('.listing-options-buttons').css('flex-direction', 'horizontal');
		$('.maps-properties').css('margin', '0px 8px 0px 8px');
		$('#maps-toggle-icon').attr(
			'src',
			'https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/634d6ad6450741e8b50dba48_list.svg'
		);
		$('#maps-toggle-text').text('Lista');
		$('#map').css('height', 'calc(100vh - 150px)');
	} else {
		$('#listings-list').show();
		$('.list-properties').show();
		$('#google-maps').hide();
		$('.listing-options').css('justify-content', 'space-between');
		$('.listing-options-buttons').css('flex-direction', 'vertical');
		$('.maps-properties').css('margin', '0px 16px 0px 0px');
		$('#maps-toggle-icon').attr(
			'src',
			'https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/634d56286b88220739548a60_selector.svg'
		);
		$('#maps-toggle-text').text('Mapa');
		$('#map').css('height', 'calc(100vh - 98px)');
	}
}

const locations = [
	{ lat: -23.54042427408413, lng: -46.65865707069764 },
	{ lat: -23.54144884977476, lng: -46.62977174593943 },
	{ lat: -23.560126253236284, lng: -46.611546481508654 },
];

// NOTE Listeners
$('#btn-maps').click(() => toggleMap());
