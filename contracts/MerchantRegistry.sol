// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MerchantID.sol";

contract MerchantRegistry {
    MerchantID public merchantIDContractAddress;

    // Mapping of merchant addresses to their token IDs.
    mapping(address => uint256) public merchantIDsRegistry;

    // Event emitted every time a new merchant registers.
    event MerchantRegistered(
        address indexed merchantAddress,
        uint256 merchantIdAddress,
        string ipfsHash
    );

    constructor(address _merchantIDAddress) {
        merchantIDContractAddress = MerchantID(_merchantIDAddress);
    }

    function register(string memory ipfsHash) external {
        require(
            merchantIDsRegistry[msg.sender] == 0,
            "Merchant already registered"
        );

        uint256 merchantIdAddress = merchantIDContractAddress.mint(
            msg.sender,
            ipfsHash,
            0, // initialXP can be set as 0 for now
            0 // initialCompliants can be set as 0 for now
        );
        merchantIDsRegistry[msg.sender] = merchantIdAddress;

        emit MerchantRegistered(msg.sender, merchantIdAddress, ipfsHash);
    }
}
