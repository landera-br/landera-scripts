function initMap() {
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

	google.maps.event.addListener(map, 'click', function () {
		if (infoWindow) {
			infoWindow.close();
		}
	});

	// NOTE Add some markers to the map.
	const markers = locations.map((position) => {
		const marker = new google.maps.Marker({
			position,
			icon: 'https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/6349c9c00124c054b0acad5c_marker.svg',
			label: { text: 'R$1,81M', className: 'marker-label' },
		});

		// NOTE Open info window when marker is clicked
		marker.addListener('click', () => {
			// NOTE Center map
			var divHeightOfTheMap = document.getElementById('map').clientHeight;
			var offSetFromBottom = document.getElementById('map').clientHeight * 0.4; // 40% of the screen height

			map.setCenter(marker.getPosition());
			map.panBy(0, -(divHeightOfTheMap / 2 - offSetFromBottom));

			const contentString =
				'<div class="card-listing"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62cdd6804af009702c397856_placeholder.png" loading="lazy" width="240" sizes="280px" srcset="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62cdd6804af009702c397856_placeholder-p-500.png 500w, https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62cdd6804af009702c397856_placeholder.png 600w" alt="" class="listing-thumbnail"><div class="listing-data"><div class="property-features"><div class="listing-price">R$ 100.000.000</div><div class="property-type">Apartamento</div></div><div class="property-address"><div class="address truncate">Rua This is some text inside of </div></div><div class="property-overview"><div class="icon-wrapper"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/63499bb335d9db97a070b68d_area-dark.svg" loading="lazy" width="24" alt="" class="card-icon"><div class="card-icon-text">1200 m2</div></div><div class="icon-wrapper"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62c9ae5e4f9abc652cde4a10_bed.svg" loading="lazy" width="24" alt="" class="card-icon"><div class="card-icon-text">10</div></div><div class="icon-wrapper"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62c9ae5ee45b2d182f9cf895_shower.svg" loading="lazy" width="24" alt="" class="card-icon"><div class="card-icon-text">10</div></div><div class="icon-wrapper"><img src="https://uploads-ssl.webflow.com/62752e31ab07d3826583c09d/62c9ae5e7c26b50c463fd35e_car.svg" loading="lazy" width="24" alt="" class="card-icon"><div class="card-icon-text">10</div></div></div></div></div>';

			infoWindow.setContent(contentString);
			infoWindow.open(map, marker);
		});

		return marker;
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
				label: { text: String(count), color: 'rgba(255,255,255,0.9)', fontSize: '12px' },
				zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
			});
		},
	};

	// NOTE Add a marker clusterer to manage the markers.
	new markerClusterer.MarkerClusterer({ map, markers, renderer });
}

const locations = [
	{ lat: -23.54042427408413, lng: -46.65865707069764 },
	{ lat: -23.54144884977476, lng: -46.62977174593943 },
	{ lat: -23.560126253236284, lng: -46.611546481508654 },
];

window.initMap = initMap;
