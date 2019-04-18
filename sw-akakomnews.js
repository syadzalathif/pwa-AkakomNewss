//static-cache merupakan ID, yg disimpan dalam cache ada pada urlsToCahe
var	CACHE_NAME	=	'akakomnews-cache';
var	urlsToCache	=	[
	'.', //semua file yg ada di root, disiapkan utk dilakukan cache
	'index.html',
	'styles/main.css'
];

//life cycle: install
self.addEventListener('install', function(event)	{
	event.waitUntil(
		caches.open(CACHE_NAME) //buka cache name
		.then(function(cache)	{
			return	cache.addAll(urlsToCache); //jika berhasil maka lakukan cache (menambahkan semua url)
		})
	);
});
//life cycle: fetch
self.addEventListener('fetch', function(event)	{
	event.respondWith(
		caches.match(event.request) //cek server punya data yang di-request atau tidak
		.then(function(response) { //jika punya, maka berikan respon
			return	response || fetchAndCache(event.request);
		})
	);
});

function fetchAndCache(url) {
	return fetch(url)
	.then(function(response) {
		//Check if we received a valid response
		if (!response.ok) {
			throw Error(response.statusText);
		}
		return caches.open(CACHE_NAME)
		.then(function(cache) {
			cache.put(url, response.clone());
			return response;
		});
	})
	.catch(function(error) {
		console.log('Request failed:', error);
		//You could return a custom	offline 404 page here
	});
}