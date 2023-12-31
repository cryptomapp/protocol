// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./MerchantID.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MerchantRegistry is Ownable {
    MerchantID public merchantIDContract;

    // Mapping of merchant addresses to their token IDs.
    mapping(address => uint256) public merchantIDsRegistry;

    // Event emitted every time a new merchant registers.
    event NewMerchantRegistered(
        address indexed merchantAddress,
        uint256 merchantId,
        string arweaveID
    );

    constructor(address _merchantIDAddress) {
        merchantIDContract = MerchantID(_merchantIDAddress);
    }

    function register(
        address merchantAddress,
        string memory arweaveID
    ) external {
        require(
            merchantIDsRegistry[merchantAddress] == 0,
            "Merchant already registered"
        );

        uint256 merchantId = merchantIDContract.mint(
            merchantAddress,
            arweaveID
        );
        merchantIDsRegistry[merchantAddress] = merchantId;

        emit NewMerchantRegistered(merchantAddress, merchantId, arweaveID);
    }

    // Function to retrieve the merchantID of a given merchantAddress.
    // return 0 if not registered.
    function getMerchantID(
        address merchantAddress
    ) public view returns (uint256) {
        return merchantIDsRegistry[merchantAddress];
    }
}
