const {exec} = require('child_process');
const ps = require('path');
const sep = ps.sep;
const root = ps.resolve(__dirname,'../../');
const dev = process.argv[5];
const platfrom = process.argv[3];
const package = require(root+sep+'package.json');
const bundle_path = "dist"+sep+package.name+"-"+platfrom+"-"+((dev==false)?'prod':'dev')+"."+package.version+".bundle";
const assets_path = "dist"+sep+package.name+"-"+platfrom+"-"+((dev==false)?'prod':'dev')+"."+package.version+".assets";
let cmd = "cd "+root+" && node node_modules/react-native/local-cli/cli.js bundle --platform "+platfrom+" --dev "+dev+" --entry-file src/app.js --bundle-output "+bundle_path+" --assets-dest "+assets_path+" --config node_modules/react-native-applet/.metro.config.js --reset-cache";
exec(cmd,function(err,stdout){
    if(err){
        console.error(err);
    }else{
        console.log(stdout);
    }
});


