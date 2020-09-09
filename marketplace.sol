// SPDX-License-Identifier: MIT
pragma solidity >=0.4.23;

interface NFT{
    function ownerOf(uint256 _tokenId) external  view returns (address);
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable;
   function tokenDetails (uint256 _tokenId) external view returns (uint256,uint256);
}

contract MarketPlace{
    
    NFT public called_address;
    
    address public owner_address;
   
    uint256[] tokenid_added;
    
    uint256 public available_token_count;
     
    mapping(uint256 => token_sell_information) public token_details;
    
    struct token_sell_information{
        bool is_available;
        address buyer;
        address seller;
    }
    
    modifier onlyOwner {
      require(msg.sender == owner_address);
      _;
   }
    

    constructor() public{
           owner_address=msg.sender;
       }
    

    function setAddress(address _address) public onlyOwner{              //set NFT token contract address
        called_address = NFT(_address);
    }
    
    
    function sell(uint256 _tokenId) public{                                  //put tokenid for sell
        require(called_address.ownerOf(_tokenId ) == msg.sender);
        uint256 present=0;
        for(uint256 i=0;i<tokenid_added.length;i++){
            if(tokenid_added[i]==_tokenId){
                present=1;
                break;
            }
            
        }
        if(present==0){
         tokenid_added.push(_tokenId);
        }
        token_details[_tokenId].is_available=true;
        token_details[_tokenId].seller=msg.sender;
        token_details[_tokenId].buyer=address(0);
        available_token_count++;
        
    }     
       

       
    function showAvailableToken() public view returns(uint256[] memory available){
          uint256[] memory available_token_for_sell = new uint[](available_token_count);
          uint j;
        for(uint256 i=0;i<tokenid_added.length;i++){
            if(token_details[tokenid_added[i]].is_available==true){
                available_token_for_sell[j]=tokenid_added[i];
                j++;
            }
        }
        return available_token_for_sell;
      
    }

 
    function buy(uint256 _tokenId) public payable{                                
        address owner;
        owner=called_address.ownerOf(_tokenId);  
        require(owner == token_details[_tokenId].seller); //checks token owner is the seller of token
        uint256 token_type;
        uint256 value;
        (token_type,value)=called_address.tokenDetails(_tokenId);
        require(msg.value >=value );   //check given value is greater or equal to token value 
        address seller;
        seller = token_details[_tokenId].seller;
        require(seller!=address(0));
        called_address.safeTransferFrom(seller,msg.sender,_tokenId);
        token_details[_tokenId].is_available=false;
        token_details[_tokenId].buyer=msg.sender;
        available_token_count--;
    }
    
}