// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Compliant is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _compliantIds;

    struct CompliantData {
        string description;
        bool resolved;
    }

    // Mapping from merchant address to number of unresolved complaints
    mapping(address => uint256) private _unresolvedComplaints;

    mapping(uint256 => CompliantData) private _compliantData;

    event NewComplaint(uint256 merchantID, address owner, string description);
    event SuspiciousMerchant(address merchantAddress);

    constructor() ERC721("Merchant Compliant", "COMPLIANT") {}

    function mint(
        address to,
        string memory description
    ) public returns (uint256) {
        _compliantIds.increment();
        uint256 newCompliantId = _compliantIds.current();
        _mint(to, newCompliantId);
        _compliantData[newCompliantId] = CompliantData(description, false);

        _unresolvedComplaints[to] += 1;

        emit NewComplaint(newCompliantId, to, description);

        // Check if there are 3 unresolved complaints for the merchant and emit an event if true
        if (_unresolvedComplaints[to] == 3) {
            emit SuspiciousMerchant(to);
        }

        return newCompliantId;
    }

    function resolveCompliant(uint256 compliantId) public {
        require(
            ownerOf(compliantId) == msg.sender,
            "Not the owner of this compliant"
        );
        _compliantData[compliantId].resolved = true;

        _unresolvedComplaints[msg.sender] -= 1;
    }

    function getCompliant(
        uint256 compliantId
    ) public view returns (CompliantData memory) {
        return _compliantData[compliantId];
    }

    function getUnresolvedComplaints(
        address merchantAddress
    ) public view returns (uint256) {
        return _unresolvedComplaints[merchantAddress];
    }
}
