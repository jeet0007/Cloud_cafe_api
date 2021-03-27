const fs = require("fs");


exports.generateFile = async (publicIp) => {
    const promise = new Promise(function (resolve, reject) {
        fs.readFile('services/dcv/template.txt', "utf-8", function (err, data) {
            if (err) {
                console.log(err);
            }
            if (data) {
                var data_array = data.split(/\r?\n/);
                data_array[3] = "host=" + publicIp;
                var data_edited = ""
                console.log(data_array);
                data_array.forEach(element => {
                    data_edited += element.toString() + "\r\n"
                });
                resolve(data_edited);
            }
        });
    });
    return promise
}
