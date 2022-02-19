// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MyIco {
  //returns the total token supply
  uint public totalSupply;
  //returns the address' token balance
  mapping(address => uint) balanceOf; 

  constructor(uint256 _initialSupply) public {
    //we set the total supply when contract is created
    totalSupply = _initialSupply;
  }
}
