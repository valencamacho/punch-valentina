function urlencode(x) {
    return escape(x).replace('+','%2B').replace('/','%2F').replace('@','%40').replace('%20','+');
}

function getAuthSig(queryDict) {
    var keys = [];
    for (var key in queryDict)
        keys.push(key);
    keys.sort();
    var queries = [];
    for (var i in keys)
        queries.push( urlencode(keys[i]) + '=' + urlencode(queryDict[keys[i]]) );
    var data = queries.join('&') + APP_SECRET;
    return SHA1(data);
}

exports = {
	getAuthSig: getAuthSig
};