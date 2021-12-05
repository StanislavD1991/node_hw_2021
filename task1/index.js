const {readdir, stat, copyFile, mkdir} = require('fs');
const path = require('path');
const folder = path.resolve(__dirname, 'dirs');
const new_folder = path.resolve(__dirname, 'new_dirs');

let counter = 0;

function createDir(path, cb){
    mkdir(path, (err) => {
        if (err && err.code !== 'EEXIST'){
            return cb(err, false);
        }
        cb(null, true);
    });
    return true;
}

function reader(src){
    readdir(src, (err, files) => {
        if (err) throw err;

        for(let i = 0; i < files.length; i++){
            const currentPath = path.resolve(src, files[i]);
            console.log(`currentPath: ${currentPath}`);

            stat(currentPath, (err, stats) => {
                if (err) throw err;                  

                if (stats.isFile()){                        
                    createDir(new_folder, (err) => {
                        if (err) throw err;

                        const localeDir = path.resolve(new_folder, files[i][0].toUpperCase());
                        const localeFile = path.resolve(localeDir, files[i]);

                        createDir(localeDir, (err) => {
                            if (err) throw err;

                            copyFile(currentPath, localeFile, (err) => {
                                if (err) throw err;
                                counter++;
                                console.log('copyFile', `count: ${counter}`);
                            });
                        });
                    });
                }
                else{
                    reader(currentPath);
                }
            });
        }
    });
    return true;
}

try{
    reader(folder);
}
catch(error){
    console.log(error);
}