const bcrypt = require('bcryptjs');

function bcryptData(value){
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(value, salt);
    return hash
}

module.exports = {bcryptData}