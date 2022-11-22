const CACHE_NAME = "version-1";
const urlsToCache = ['index.html', 'offline.html'];

const self = this;
//3 events

//install sw
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache)=>{
                console.log('open cache');
                return cache.addAll(urlsToCache);
            })
    )
});

// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(()=>{
                return fetch(event.request)
                    .catch(()=>caches.match('offline.html'))
            })
    )
});

// activate the sw
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    event.wailUntil(
        caches.keys().then((cacheNames)=>Promise.all(
            cacheNames.map((cacheName=> {
                if(!cacheWhitelist.includes(cacheName)){
                    return caches.delete(cacheName);
                }
            }))
        ))
    )
});