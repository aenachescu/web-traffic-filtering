let filteredUrls = [
    //"<all_urls>"
    "http://www.phiorg.ro/*"
];

async function onBeforeRequestCbk(details) {
    await console.info(`called onBeforeRequestCbk requestId = ${details.requestId}`);

    let requestId = details.requestId;
    let filter = await browser.webRequest.filterResponseData(requestId);
    let decoder = await new TextDecoder("utf-8");
    let encoder = await new TextEncoder();

    /*
     * send documentUrl, originUrl, url, method and requestBody to native app
     */

    filter.ondata = async function(event) {
        await console.info(`called ondata requestId = ${requestId}`);

        let data = await decoder.decode(event.data, { stream: true });
        await console.info(`received data on requestId = ${requestId}, data = ${data}`);

        /*
         * send response's body to native app
         */

        await console.info(`returned from ondata requestId = ${requestId}`);
    }

    filter.onstop = async function(event) {
        await console.info(`called onstop requestId = ${requestId}`);

        let data = "modified content";
        /*
         * get response's body from native app
         */

        await filter.write(encoder.encode(data));
        await filter.close();

        await console.info(`returned from onstop requestId = ${requestId}`);
    }

    await console.info(`returned from onBeforeRequestCbk requestId = ${requestId}`);
    return {};
}

async function onBeforeSendHeadersCbk(details) {
    await console.info(`called onBeforeSendHeadersCbk requestId = ${details.requestId}`);

    /*
     * send request's headers to native app and wait for response
     */

    await console.info(`returned from onBeforeSendHeadersCbk requestId = ${details.requestId}`);
    return { requestHeaders: details.requestHeaders };
}

async function onHeadersReceivedCbk(details) {
    await console.info(`called onHeadersReceivedCbk requestId = ${details.requestId}`);

    /*
     * send statusLine and response's headers to native app and wait for response
     */

    await console.info(`returned from onHeadersReceivedCbk requestId = ${details.requestId}`);
    return { responseHeaders: details.responseHeaders };
}

browser.webRequest.onBeforeRequest.addListener(
    onBeforeRequestCbk,
    {
        urls: filteredUrls,
    },
    [
        "blocking",
        "requestBody"
    ]
);

browser.webRequest.onBeforeSendHeaders.addListener(
    onBeforeSendHeadersCbk,
    {
        urls: filteredUrls
    },
    [
        "blocking",
        "requestHeaders"
    ]
);

browser.webRequest.onHeadersReceived.addListener(
    onHeadersReceivedCbk,
    {
        urls: filteredUrls
    },
    [
        "blocking",
        "responseHeaders"
    ]
);
