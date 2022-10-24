let zIndex = 99;
const BRAZILIAN_BOUNDING_BOX = [-73.9872354804, -33.7683777809, -34.7299934555, 5.24448639569];
const searchParams = new URLSearchParams(window.location.search);
let offerType = searchParams.has('offer') ? searchParams.get('offer') : 'sale';
let i = 0;
const initialMapProps = {
	mapId: 'c905ad459d6961a8',
	zoom: 12,
	center: { lat: -23.5874, lng: -46.6576 },
	zoomControl: true,
	mapTypeControl: false,
	scaleControl: true,
	streetViewControl: true,
	rotateControl: false,
	fullscreenControl: true,
};
let clusters;
const index = new Supercluster({ radius: 60, maxZoom: 16 });

if (offerType === 'rent') {
	$('#radio-offer-type-sale').prop('checked', false);
	$('#radio-offer-type-rent').prop('checked', true);
} else {
	$('#radio-offer-type-sale').prop('checked', true);
	$('#radio-offer-type-rent').prop('checked', false);
}

$('#search-form-block').show();

window.initMap = initMap;

// NOTE When page is loaded
async function initMap() {
	let listings = [];
	const searchInput = document.getElementById('search-input');
	const autocomplete = new google.maps.places.Autocomplete(searchInput);
	const map = new google.maps.Map(document.getElementById('map'), initialMapProps);
	const infoWindow = new google.maps.InfoWindow({ content: '', disableAutoPan: true });
	let clusterInstance;
	let clusters;
	let clusterObj;

	// NOTE Get listings data
	try {
		const response = await fetch(
			`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/listings?offer_type=${offerType}`,
			{ method: 'GET' }
		);

		if (response.status !== 200) {
			throw new Error('Não foi possível recuperar dados de imóveis. Tente novamente mais tarde.');
		} else {
			const responseJson = await response.json();

			responseJson.forEach((element) => {
				listings.push({
					price: element.offer_type.sale ? element.sales_price : element.rent_price,
					thumb_url: element.thumb_url,
					location: { lat: element.location.coordinates[1], lng: element.location.coordinates[0] },
					geometry: element.location,
					prop_type: element.prop_type,
					address: element.address,
					area: element.area,
					bedrooms: element.bedrooms,
					bathrooms: element.bathrooms,
					parking_lots: element.parking_lots,
					url: `listings/${element._id}`,
				});
			});
		}
	} catch (error) {
		return alert(
			error.display && error.message
				? error.message
				: 'Não foi possível recuperar dados de imóveis. Tente novamente mais tarde.'
		);
	}

	listings = listings.filter(
		(listing) => listing.location.lat && listing.location.lng && listing.price
	);

	// NOTE Add markers to the map
	let markers = listings.map((listing) => {
		const marker = new google.maps.Marker({
			position: listing.location,
			icon: 'https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/634a1c5e5cb8ac328de736c5_marker-bg.svg',
			label: { text: abbreviatePrice(listing.price), className: 'marker-label' },
		});

		// NOTE Open info window when marker is clicked
		if (isTouchDevice()) {
			marker.addListener('click', () => displayCard(listing, marker, infoWindow));
		} else {
			marker.addListener('click', () => window.open(listing.url, '_blank'));
			marker.addListener('mouseover', () => displayCard(listing, marker, infoWindow));
		}

		// NOTE Close
		marker.addListener('mouseout', () => {
			const label = marker.getLabel();
			label.color = '#2AB24D';
			label.fontWeight = '500 !important';
			marker.setLabel(label);
			if (infoWindow) infoWindow.close();
		});

		return marker;
	});

	clusterObj = plotMap(markers, map, listings, infoWindow);
	clusterInstance = clusterObj.clusterInstance;
	clusters = clusterObj.clusters;

	// NOTE When users search a place
	autocomplete.addListener('place_changed', () => {
		infoWindow.close();

		const place = autocomplete.getPlace();

		if (!place.geometry || !place.geometry.location) {
			window.alert('Não foi possível encontrar o endereço digitado.');
			return;
		}

		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
	});

	// NOTE When filters are confirmed
	$('#btn-filter-confirm, #btn-interest-close').on('click', async (e) => {
		e.preventDefault();
		const offerTypeOption = $('input[name=radio-offer-type]:checked', '#form-filter').val();

		$('#filter-modal').hide();

		if (offerType !== offerTypeOption) {
			// NOTE Delete markers and clusters from the map
			clearMarkers(markers);
			clusterInstance.removeMarkers(clusters);
			clusterInstance.clearMarkers();

			listings = [];

			// NOTE Get listings data
			try {
				const response = await fetch(
					`https://landera-network-7ikj4ovbfa-uc.a.run.app/api/v1/listings?offer_type=${offerTypeOption}`,
					{ method: 'GET' }
				);

				if (response.status !== 200) {
					$(`#radio-offer-type-${offerType}`).prop('checked', true);

					throw new Error(
						'Não foi possível recuperar dados de imóveis. Tente novamente mais tarde.'
					);
				} else {
					const responseJson = await response.json();

					responseJson.forEach((element) => {
						listings.push({
							price: element.offer_type.sale ? element.sales_price : element.rent_price,
							thumb_url: element.thumb_url,
							location: {
								lat: element.location.coordinates[1],
								lng: element.location.coordinates[0],
							},
							geometry: element.location,
							prop_type: element.prop_type,
							address: element.address,
							area: element.area,
							bedrooms: element.bedrooms,
							bathrooms: element.bathrooms,
							parking_lots: element.parking_lots,
							url: `listings/${element._id}`,
						});
					});

					markers = listings.map((listing) => {
						const marker = new google.maps.Marker({
							position: listing.location,
							icon: 'https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/634a1c5e5cb8ac328de736c5_marker-bg.svg',
							label: { text: abbreviatePrice(listing.price), className: 'marker-label' },
						});

						// NOTE Open info window when marker is clicked
						if (isTouchDevice()) {
							marker.addListener('click', () => displayCard(listing, marker, infoWindow));
						} else {
							marker.addListener('click', () => window.open(listing.url, '_blank'));
							marker.addListener('mouseover', () => displayCard(listing, marker, infoWindow));
						}

						// NOTE Close
						marker.addListener('mouseout', () => {
							const label = marker.getLabel();
							label.color = '#2AB24D';
							label.fontWeight = '500 !important';
							marker.setLabel(label);
							if (infoWindow) infoWindow.close();
						});

						return marker;
					});

					clusterObj = plotMap(markers, map, listings, infoWindow);
					clusterInstance = clusterObj.clusterInstance;
					clusters = clusterObj.clusters;
					offerType = offerTypeOption;
				}
			} catch (error) {
				return alert(
					error.display && error.message
						? error.message
						: 'Não foi possível recuperar dados de imóveis. Tente novamente mais tarde.'
				);
			}
		}
	});
}

// NOTE Support functions
function displayCard(listing, marker, infoWindow) {
	const contentString = `<a href="${
		listing.url
	}" target="_blank" class="listing-card maps" style="text-decoration:none;color:#1c1548;"><img src="${
		listing.thumb_url
	}" loading="lazy" width="320" height="180" sizes="320px" srcset="${listing.thumb_url} 500w, ${
		listing.thumb_url
	} 600w" alt="" class="listing-thumbnail maps"><div class="listing-data maps"><div class="property-features maps"><div class="listing-price maps">${formatPrice(
		listing.price
	)}</div><div class="property-type maps">${
		listing.prop_type
	}</div></div><div class="property-address maps"><div class="address truncate maps">${
		listing.address
	}</div></div><div class="property-overview maps"><div class="icon-wrapper maps area"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/63499bb335d9db97a070b68d_area-dark.svg" loading="lazy" width="24" alt="" class="card-icon maps"><div class="card-icon-text maps">${
		listing.area
	} m²</div></div><div class="icon-wrapper maps bedrooms"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62c9ae5e4f9abc652cde4a10_bed.svg" loading="lazy" width="24" alt="" class="card-icon maps"><div class="card-icon-text maps">${
		listing.bedrooms
	}</div></div><div class="icon-wrapper maps bathrooms"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62c9ae5ee45b2d182f9cf895_shower.svg" loading="lazy" width="24" alt="" class="card-icon maps"><div class="card-icon-text maps">${
		listing.bathrooms
	}</div></div><div class="icon-wrapper maps parking-lots"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62c9ae5e7c26b50c463fd35e_car.svg" loading="lazy" width="24" alt="" class="card-icon maps"><div class="card-icon-text maps">${
		listing.parking_lots
	}</div></div></div></div></a>`;

	updateZIndex(marker);

	infoWindow.setContent(contentString);
	infoWindow.open({ anchor: marker, map, shouldFocus: false });
}

function updateZIndex(marker) {
	const label = marker.getLabel();
	label.fontWeight = 'bold !important';
	marker.setLabel(label);
	marker.setZIndex(zIndex + 1);
	zIndex += 1;
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
		$('.listing-options-buttons').css('flex-direction', 'row');
		$('.maps-properties').css('margin', '0px 4px 0px 4px');
		$('#maps-toggle-icon').attr(
			'src',
			'https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/634d6ad6450741e8b50dba48_list.svg'
		);
		$('#maps-toggle-text').text('Lista');
		$('#map').css('height', 'calc(100vh - 126px)');
	} else {
		$('#listings-list').show();
		$('.list-properties').show();
		$('#google-maps').hide();
		$('.listing-options').css('justify-content', 'space-between');
		$('.listing-options-buttons').css('flex-direction', 'column');
		$('.maps-properties').css('margin', '0px 0px 8px 0px');
		$('#maps-toggle-icon').attr(
			'src',
			'https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/634d56286b88220739548a60_selector.svg'
		);
		$('#maps-toggle-text').text('Mapa');
		$('#map').css('height', 'calc(100vh - 74px)');
	}
}

function clearMarkers(markers) {
	markers.forEach((marker) => {
		marker.setMap(null);
	});
}

function abbreviatePrice(price) {
	return `R$${Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumFractionDigits: 1,
	}).format(price)}`;
}

function formatPrice(price) {
	return Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0,
	}).format(price);
}

function plotMap(markers, map, listings, infoWindow) {
	let clusterInstance;
	i = 0;

	// NOTE Get clusters data
	index.load(listings);

	clusters = index
		.getClusters(BRAZILIAN_BOUNDING_BOX, map.getZoom())
		.filter((cluster) => cluster.type === 'Feature');

	// NOTE Calculate clusters
	const renderer = {
		render: function ({ count, position }) {
			if (Array.isArray(clusters) && clusters.length) {
				// NOTE Get cluster leaves
				const leaves = index.getLeaves(clusters[i].id, Infinity);

				// NOTE Calculate average and add cluster marker
				const average = leaves.reduce((total, next) => total + next.price, 0) / leaves.length;
				const marker = new google.maps.Marker({
					position,
					icon: 'https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/634a1c5e5cb8ac328de736c5_marker-bg.svg',
					label: {
						text: `~${abbreviatePrice(average)}`,
						color: 'black',
						fontSize: '14px',
						fontWeight: '500',
					},
					zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
				});

				zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;
				i++;

				if (!isTouchDevice()) {
					marker.addListener('mouseover', () => updateZIndex(marker));
					marker.addListener('mouseout', () => {
						const label = marker.getLabel();
						label.color = 'black';
						label.fontWeight = '500';
						marker.setLabel(label);
					});
				}

				// NOTE Create cluster marker
				return marker;
			} else {
				return undefined;
			}
		},
	};

	// NOTE Add clusters to the map
	if (renderer.render) {
		clusterInstance = new markerClusterer.MarkerClusterer({ map, markers, renderer });
	} else {
		clusterInstance = new markerClusterer.MarkerClusterer({ map, markers });
	}

	// NOTE When map is clicked
	google.maps.event.addListener(map, 'click', function () {
		if (infoWindow) infoWindow.close();
	});

	// NOTE When zoom is changed
	google.maps.event.addListener(map, 'zoom_changed', function () {
		i = 0;
		clusters = index
			.getClusters(BRAZILIAN_BOUNDING_BOX, map.getZoom())
			.filter((cluster) => cluster.type === 'Feature');
	});

	return { clusterInstance, clusters };
}

// NOTE Listeners
$('#btn-maps').click(() => toggleMap());

$('#search-form-block').submit(() => false);

$('#btn-filter').on('click', () => {
	$('#filter-modal').show();

	$('#btn-filter-reset').on('click', (e) => {
		e.preventDefault();
		$('#filter-modal').hide();
	});
});
