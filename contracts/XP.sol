// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XP is ERC20, Ownable {
    constructor() ERC20("Merchant XP", "XP") {}

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }

    // Prevent transfers by overriding the transfer function
    function transfer(address, uint256) public pure override returns (bool) {
        revert("XP is non-transferable");
    }

    // Prevent transfers by overriding the transferFrom function
    function transferFrom(
        address,
        address,
        uint256
    ) public pure override returns (bool) {
        revert("XP is non-transferable");
    }
}
