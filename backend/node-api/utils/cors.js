// for testing, we call from the same system so add cross origin headers

const self = module.exports = {
   addCORSHeaders (resp) {
     var res = resp;
     console.log("in addCORSHeaders\n");
     res.header("Access-Control-Allow-Origin", "*");
     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
     res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control,X-PINGOTHER,Authorization");
     return (res);
   }
};
