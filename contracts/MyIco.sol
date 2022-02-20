// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MyIco {
  string public name = "HBOToken";
  string public symbol = "HBO";
  uint8 public decimals = 0;
  uint public totalSupply;
  //Transfer event 
  event Transfer(address indexed _from, address indexed _to, uint _amount);
  //returns the address' token balance
  mapping(address => uint) public balanceOf; 

  constructor(uint256 initSupply) {
    //we set the total supply when contract is created
    totalSupply = initSupply;
    //allocate the total supply to the caller
    balanceOf[msg.sender] = initSupply;
  }

  function transfer(address to, uint amount) public returns(bool success){
    //check if caller has enough eth
    require(balanceOf[msg.sender] >= amount );
    //transfer balance
    balanceOf[msg.sender] -= amount;
    balanceOf[to] += amount;
    //emit transfer event 
    emit Transfer(msg.sender, to, amount);
    return true;
  }
}
