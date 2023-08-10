// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract XP is ERC20 {
    constructor() ERC20("Merchant XP", "XP") {}

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
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
