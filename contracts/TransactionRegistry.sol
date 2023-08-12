// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MerchantRegistry.sol"; // Assuming the MerchantRegistry contract is in the same directory

contract TransactionRegistry is Ownable {
    MerchantRegistry public merchantRegistry;

    // Constructor to initialize the MerchantRegistry contract address
    constructor(address _merchantRegistry) {
        merchantRegistry = MerchantRegistry(_merchantRegistry);
    }

    // Execute a transaction, transfer 99.7% to merchant, 0.3% retained as fee
    function executeTransaction(
        uint256 amount,
        address tokenAddress,
        address merchantAddress
    ) external {
        require(
            merchantRegistry.getMerchantID(merchantAddress) != 0,
            "Merchant not registered"
        );

        uint256 fee = (amount * 3) / 1000; // 0.3%
        uint256 merchantAmount = amount - fee; // 99.7%

        IERC20(tokenAddress).transferFrom(
            msg.sender,
            merchantAddress,
            merchantAmount
        );
        IERC20(tokenAddress).transferFrom(msg.sender, owner(), fee); // Transferring fee directly to the owner
    }

    // Withdraw accumulated fees (in case some funds ever get stuck)
    function withdrawFunds(address tokenAddress) external onlyOwner {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).transfer(owner(), balance);
    }
}
