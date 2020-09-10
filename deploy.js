const Web3 = require('web3');
const TX = require("ethereumjs-tx");

web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/afd7831a73cc4b769719d163b6a919ef"));

//  Contract ABI
const abi=[{"constant":true,"inputs":[],"name":"available_token_count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"showAvailableToken","outputs":[{"name":"available","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner_address","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"called_address","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"token_details","outputs":[{"name":"is_available","type":"bool"},{"name":"buyer","type":"address"},{"name":"seller","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"}],"name":"setAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
  
// Define Variable for Contract ABI
var AK = new web3.eth.Contract(abi  ,'0xeC93B294d644491cb26d6FA67a1127D1d16Fff55');



//028dedbb08007738f678446c9f1846a81242b17a843d81bd09ed216f450f747c

// Buffer PK

var privateKey =Buffer.from('028dedbb08007738f678446c9f1846a81242b17a843d81bd09ed216f450f747c','hex');


 async function sendTransaction(ether_value) {

    const gasprice=await web3.eth.getGasPrice();
   
    var count= await web3.eth.getTransactionCount('0x28744587aCff6217f1A9A615E1b7bD46326dF3e1');

    var txData = {
          
         nonce: web3.utils.toHex(count),
     
         gasLimit: web3.utils.toHex(2500000),
     
         gasPrice: web3.utils.toHex(gasprice),
     
         to: '0xeC93B294d644491cb26d6FA67a1127D1d16Fff55',

         from:'0x28744587aCff6217f1A9A615E1b7bD46326dF3e1',
           
         data: data,

         value:ether_value
   }
     
   var tx = new TX(txData, { 'chain': 'rinkeby' }); 
   
   tx.sign(privateKey);
     
   var serialisedTransaction = tx.serialize().toString('hex');
       
   await web3.eth.sendSignedTransaction('0x' + serialisedTransaction);
}



var data;
async function setAddress(address1){
  try{
    data=AK.methods.setAddress(address1).encodeABI(); 
    sendTransaction();  
  }catch(err){
    throw{message:"Error in setting address"};
  }
}

async function sell(token_id){
  try{
    
    data=AK.methods.sell(token_id).encodeABI();
    sendTransaction(); 
  }catch(err){
    throw{message:"Error in putting token for sale"};
  }
}


async function showAvailableToken(){
  try{
    var tokens=await AK.methods.showAvailableToken().call();
     //console.log(tokens);
    return tokens;
  }catch(err){
    throw {message:"Error in showing available tokens"};
  }
}


async function buy(token_id,ether_value){
  try{
    data=AK.methods.buy(token_id).encodeABI();
    sendTransaction(ether_value);
  }catch(err){
    throw {message :"Error in buying token"};
  }

}
async function  call_functions(){
    await setAddress('0xa4Eb8a64fFC2316C73E98FC17eFA895360bF59e3');
    //sell('2');
    //var tokens=await showAvailableToken();
     //console.log(tokens);
     //buy('2','20');
}

call_functions();




 





