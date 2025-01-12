addEventListener('fetch', function(event) {
    const { request } = event
    const response = handleRequest(request)
    event.respondWith(response)
})

// request path, Please modify this path to prevent everyone from using this worker.
const endpointPath = '';

// you can replace below server with any other DoH servers.
const doh = 'https://ipv4-vultr-ewr-1.edge.nextdns.io' // this is unicast New-York Next-DNS ultralow. very good one, change it on your desire.

// NOTE: below server is in JSON format. For example Google DoH JSON is https://dns.google/resolve (it's not always dns-query).
const dohjson = '' // GET format, fast JS

const contype = 'application/dns-message'
const jstontype = 'application/dns-json'

async function handleRequest(request) {
    const clientUrl = new URL(request.url);
    const { method, headers, url } = request
    const searchParams = new URL(url).searchParams
    if (clientUrl.pathname != endpointPath) {
        return new Response('Not Found. HTTP 404.', { status: 404 });
    } else if (method == 'GET' && searchParams.has('dns')) {
        return await fetch(doh + '?dns=' + searchParams.get('dns'), {
            method: 'GET',
            headers: {
                'Accept': contype,
            }
        });
    } else if (method == 'POST' && headers.get('content-type') == contype) {
        return await fetch(doh, {
            method: 'POST',
            headers: {
                'Accept': contype,
                'Content-Type': contype,
            },
            body: await request.arrayBuffer()
        });
    } else if (method == 'GET' && headers.get('Accept') == jstontype) {
        const search = new URL(url).search
         return await fetch(dohjson + search, {
            method: 'GET',
            headers: {
                'Accept': jstontype,
            }
        });
    } else {
        return new Response("Not Found. HTTP 404.", {status: 404})
    }
}
