// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MyIco {
  string public name = "Token";
  string public symbol = "MTK";
  uint8 public decimals = 0;
  uint public totalSupply;
  //Transfer event 
  event Transfer(address indexed _from, address indexed _to, uint _amount);
  event Approval(address indexed owner, address indexed spender, uint amount);
  //returns the address' token balance
  mapping(address => uint) public balanceOf; 
  mapping(address => mapping(address => uint)) public allowance;

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

  function approve(address spender, uint amount) public returns (bool success) {
    allowance[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(address from, address to, uint amount) public returns(bool success){
    //check if caller has enough eth
    require(balanceOf[from] >= amount );
    require(allowance[from][msg.sender] >= amount);
    //transfer balance
    balanceOf[from] -= amount;
    balanceOf[to] += amount;
    //update allowance
    allowance[from][msg.sender] -= amount;    
    //emit transfer event 
    emit Transfer(from, to, amount);
    return true;
  }

}
