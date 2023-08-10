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

    mapping(uint256 => CompliantData) private _compliantData;

    event NewComplaint(uint256 merchantID, address owner, string description);

    constructor() ERC721("Merchant Compliant", "COMPLIANT") {}

    function mint(
        address to,
        string memory description
    ) public returns (uint256) {
        _compliantIds.increment();
        uint256 newCompliantId = _compliantIds.current();
        _mint(to, newCompliantId);
        _compliantData[newCompliantId] = CompliantData(description, false);

        emit NewComplaint(newCompliantId, to, description);

        return newCompliantId;
    }

    function resolveCompliant(uint256 compliantId) public {
        require(
            ownerOf(compliantId) == msg.sender,
            "Not the owner of this compliant"
        );
        _compliantData[compliantId].resolved = true;
    }

    function getCompliant(
        uint256 compliantId
    ) public view returns (CompliantData memory) {
        return _compliantData[compliantId];
    }
}
