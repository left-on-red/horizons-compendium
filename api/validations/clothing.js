let types = [
    'top',
    'hat',
    'bottom',
    'dress',
    'accessory',
    'socks',
    'shoes',
    'bag',
    'umbrella'
]


module.exports = function(data) {
    if (!types.includes(data.type)) { return false }
    if (data.colors.length == 0) { return false }

    if (data.defaultColor == '') { data.defaultColor = data.colors[0] }
    else if (!data.colors.includes(data.defaultColor)) { return false }

    return true;
}