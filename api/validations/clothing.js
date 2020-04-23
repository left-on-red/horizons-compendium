/*{
    "name": "",
    "type": "",
    "colors": [],
    "obtained": "",
    "cataloggable": true,
    "value": 0
}*/

module.exports = function(data) {
    switch(data.type) {
        case 'top': return true;
        case 'hat': return true;
        case 'bottom': return true;
        case 'dress': return true;
        case 'accessory': return true;
        case 'socks': return true;
        case 'shoes': return true;
        case 'bag': return true;
        case 'umbrella': return true;
        default: return false;
    }
}