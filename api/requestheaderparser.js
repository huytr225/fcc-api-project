exports.rhp = function (headers) {
    var response = {
        ipaddress: headers['x-forwarded-for'],
        language:  headers['accept-language'],
        software:  headers['user-agent']
    }
    return response;
}