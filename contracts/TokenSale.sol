// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./MyIco.sol";

contract TokenSale {

  address admin;
  uint public tokenPrice = 100000000000000000;
  MyIco public tokenContract;

  constructor(MyIco _tokenContract, uint _tokenPrice){
    admin = msg.sender;
    tokenContract = _tokenContract;
    tokenPrice = _tokenPrice;
  }

  function buyTokens(uint nOfTokens) public {
      
  }
}
