const fs = require('fs');
const crypto = require('crypto');
const chokidar = require('chokidar');
const chalk = require('chalk');
const express = require('express');
const expressWs = require('express-ws');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const AdmZip = require("adm-zip");
const {execSync} = require('child_process');
const ps = require('path');
run();

async function run(){
    
    const sep = ps.sep;
    const root = ps.resolve(__dirname,'../../');
    const dev = process.argv[5];
    const platfrom = process.argv[3];
    const package = require(root+sep+'package.json');
    const release_dir = "dist"+sep+package.namespace+"."+package.name.toLowerCase()+"-"+platfrom+"."+package.version+sep;
    const release_bundle = release_dir+"app.bundle";
    var wss;
    let cmd = "cd "+root+" && node node_modules/react-native/local-cli/cli.js bundle --platform "+platfrom+" --dev "+dev+" --entry-file src/app.js --bundle-output "+release_bundle+" --assets-dest "+release_dir+" --config node_modules/react-native-applet/.metro.config.js --reset-cache && cp logo.png dist/logo.png";
    if(dev==="true"){
        const app = express();
        let filesToBuild = new Map();
        let hash = '';
        expressWs(app);
        app.use(bodyParser.urlencoded({extended:false}));
        app.use(bodyParser.json());
        app.use(express.static(root+"/dist"));
        expressWs(app);
        app.get('/',(req,res) => res.send({name:package.name,namespace:package.namespace,author:package.author,image:"logo.png",version:package.version,hash,file:hash+".zip",dev:true}));
        app.post('/logs',(req, res) => console.log(dateFormat("YYYY-mm-dd HH:MM:SS",new Date())+" "+req.body.tag+" ----> "+req.body.message));
        app.get('/server',(req, res) => connect(parseInt(req.query.port),req.query.ip));
        app.listen(9999,() => console.log(chalk.green('->'),platfrom+' dev server on port 9999'));
        app.ws('/', function (ws, req){
            wss = ws;
            console.log(chalk.green('->'),"connected");
        });
        chokidar.watch(ps.resolve(root,'src'),{ignoreInitial:true}).on('all',(event,filename)=>{
            if ((event === 'add' || event === 'change')) {
                filesToBuild.set(filename,true);
            }
        });
        setInterval(() => {
            const files = Array.from(filesToBuild.keys());
            if (files.length>0) {
                filesToBuild = new Map();
                try {
                    if(wss){
                        wss.send("build-start");
                    }
                    let dir = uuid.v4().split('-').join('');
                    let cmd = "cd "+root+" && node node_modules/react-native/local-cli/cli.js bundle --platform "+platfrom+" --dev "+dev+" --entry-file src/app.js --bundle-output dist/"+dir+"/app.bundle --assets-dest dist/"+dir+" --config node_modules/react-native-applet/.metro.config.js --reset-cache && cp logo.png dist/logo.png";
                    console.log(chalk.green('->'),'build');
                    let buffer = execSync(cmd);
                    console.log(buffer.toString("utf-8"));
                    var zip = new AdmZip();
                    zip.addLocalFolder("dist/"+dir);
                    zip.writeZip("dist/"+dir+".zip")
                    hash = dir;
                    if(wss){
                        wss.send("build-over");
                    }
                    console.log(chalk.green('->'),"hash = "+hash);
                } catch (e) {
                    console.log(chalk.red('->'),"build error "+e);
                }
            }
        },1000);
        filesToBuild.set("/", true);
    }else{
        let buffer = execSync(cmd);
        console.log(buffer.toString("utf-8"));
        execSync("cp logo.png "+release_dir);
        let zipName = package.namespace+"."+package.name.toLowerCase()+"-"+platfrom+"-"+package.version+".zip";
        let hash = await fileHash(root+sep+release_bundle);
        fs.writeFileSync(release_dir+"app.json",JSON.stringify({name:package.name,namespace:package.namespace,author:package.author,image:"logo.png",version:package.version,hash,file:zipName,platfrom}));
        var zip = new AdmZip();
        zip.addLocalFolder(release_dir);
        zip.writeZip("dist"+sep+zipName);
    }
}
async function fileHash(file){
    return new Promise(resolve => {
        const stream = fs.createReadStream(file);
        const hash = crypto.createHash('md5');
        stream.on('data', chunk => {
            hash.update(chunk, 'utf8');
        });
        stream.on('end', () => {
            const md5 = hash.digest('hex');
            resolve(md5);
        });
    })  
}
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),       
        "m+": (date.getMonth() + 1).toString(),
        "d+": date.getDate().toString(),
        "H+": date.getHours().toString(), 
        "M+": date.getMinutes().toString(), 
        "S+": date.getSeconds().toString()
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
