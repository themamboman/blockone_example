var express = require('express');
var request = require('async-request');
var router = express.Router();
const { addCORSHeaders } = require('../utils/cors');

var latestBlockInfo = {};
var blocks = [];
var curBlock = {};

async function updLatestBlockInfo() {
   var response = null;
   var block_id_num = '';
   var obj = {};

   try {
      response = await request('https://api.eosnewyork.io/v1/chain/get_info'); 
      latestBlockInfo = response.body; 

      obj = JSON.parse(latestBlockInfo);
      block_id_num = obj.head_block_num;
      blocks = [];
      for( var i=0; i<10; i++ ) {
         console.log("getting data for block/id # " + block_id_num);
         block_id_num = await get_block( block_id_num );
         if(!block_id_num || typeof block_id_num === null) {
            console.log("invalid id returned, exiting loop");
            break;
         }
      }
      console.log("retrieved " + blocks.length + " blocks");
   } catch (e) {
      console.log("Exception caught in updLatestBlockInfo: " + e.message);
   }

}


async function get_block( block_num ) {
   console.log("get_block: " + block_num);
   var resp = null;
   var nextNum = '';
   var json = {'block_num_or_id':block_num};
   var jbody = JSON.stringify(json);
   var options = { 
       url: 'https://api.eosnewyork.io/v1/chain/get_block',
       method: 'POST',
       body: jbody
   };

   console.log("calling " + options.url);

   resp = await request( "https://api.eosnewyork.io/v1/chain/get_block", {
	  method: "POST",
	  data: jbody
	 });
  
   curBlock = JSON.parse(resp.body);
   console.log("returning previous value: " + curBlock.previous);
   blocks.push(curBlock);
   nextNum = curBlock.previous;
   curBlock = {};

   return(nextNum);
  
}


/*  GET test for get_block */
router.get('/', async function(req, res, next) {
  var output = [];
  var retval = {'output':''};
	
  // get the updated list of blocks
  await updLatestBlockInfo();
  
  // build JSON response
  output = JSON.stringify(blocks);

  // handle CORS headers
  res = addCORSHeaders(res);
  retval.output = output;
  res.send(retval);
});

module.exports = router;
