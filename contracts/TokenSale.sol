// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./MyIco.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenSale {

    using SafeMath for uint;
    address payable admin;
    uint public tokenPrice;
    uint public tokensSold;
    MyIco public tokenContract;

    event Sell(address _to, uint _amount);

    constructor(MyIco _tokenContract, uint _tokenPrice){
        admin = payable(msg.sender);
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint a, uint b) internal pure returns(uint z){
        return SafeMath.mul(a, b);
    }

    function buyTokens(uint nOfTokens) public payable {
        //make sure user is sending enough eth
        require(msg.value == multiply(nOfTokens, tokenPrice));
        //make sure contract has enough tokens
        require(tokenContract.balanceOf(address(this)) >= nOfTokens);
        //transfer tokens
        require(tokenContract.transfer(msg.sender, nOfTokens));

        tokensSold += nOfTokens;
        emit Sell(msg.sender, nOfTokens);
    }

    function endSale() public {
        //make sure caller is admin
        require(msg.sender == admin);
        //transfer remaining tokens
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        //end sale and send balance to admin
        selfdestruct(admin);
    }
}
