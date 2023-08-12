// SPDX-License-Identifier: MIT
// contracts/MockUSDC.sol

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "mUSDC") {
        // Constructor logic can be empty since minting is handled separately
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
