// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";
import "./MerchantRegistry.sol";

contract TransactionRegistry is Ownable, ERC2771Context {
    MerchantRegistry public merchantRegistry;

    // Constructor to initialize the MerchantRegistry contract address and set the trusted forwarder
    constructor(
        address _merchantRegistry,
        address _trustedForwarder
    ) ERC2771Context(_trustedForwarder) {
        merchantRegistry = MerchantRegistry(_merchantRegistry);
    }

    // Overriding the _msgSender function to use the ERC2771Context's version
    function _msgSender()
        internal
        view
        override(Context, ERC2771Context)
        returns (address)
    {
        return ERC2771Context._msgSender();
    }

    // Overriding the _msgData function to use the ERC2771Context's version
    function _msgData()
        internal
        view
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
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
            _msgSender(),
            merchantAddress,
            merchantAmount
        );
        IERC20(tokenAddress).transferFrom(_msgSender(), owner(), fee);
    }

    // Withdraw accumulated fees (in case some funds ever get stuck)
    function withdrawFunds(address tokenAddress) external onlyOwner {
        uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
        IERC20(tokenAddress).transfer(owner(), balance);
    }
}
