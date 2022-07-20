const fs = require('fs');
const ps = require('path');
const crypto = require('crypto');
const sep = ps.sep;
const type = process.argv[4];
const assets = process.argv[12];
const base = process.cwd();
const map = base+sep+"node_modules"+sep+"react-native-applet"+sep+".map."+type+".json";
try{fs.mkdirSync(base+sep+assets,{recursive:true})}catch(e){}
const mapobj = require(map);
const fileToIdMap = new Map();

module.exports = {
  projectRoot:base,
  serializer: {
    createModuleIdFactory: function(){
      return path => {
        const rpath = ps.relative(base, path);
        let id = mapobj[rpath];
        if (id)return id;
        id = fileToIdMap.get(rpath);
        if(id)return id;
        const md5 = crypto.createHash('md5');
        id = md5.update(rpath).digest('hex');
        fileToIdMap.set(rpath,id);
        return id;
      };
    },
    processModuleFilter: function processModuleFilter(module) {
      const path = module.path;
      const rpath = ps.relative(base, path);
      if(path.indexOf('__prelude__') !== -1 || path.indexOf('/node_modules/react-native/Libraries/polyfills') !== -1 || path.indexOf('source-map') !== -1 || path.indexOf('/node_modules/metro-runtime/src/polyfills/require.js') !== -1) {
        return false;
      }
      if (mapobj[rpath]) {
        return false;
      }
      return true;
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};