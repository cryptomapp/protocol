pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./XP.sol";
import "./Compliant.sol";

contract MerchantID is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from token ID to Arweave ID.
    mapping(uint256 => string) private _tokenURIs;

    // Mapping from token ID to its owner.
    mapping(uint256 => address) private _tokenOwners;

    XP public xpContract;
    Compliant public compliantContract;

    constructor(address _xpAddress, address _compliantAddress) ERC1155("") {
        xpContract = XP(_xpAddress);
        compliantContract = Compliant(_compliantAddress);
    }

    function mint(
        address to,
        string memory arweaveID
    ) external returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId, 1, "");
        _tokenURIs[newTokenId] = arweaveID;
        _tokenOwners[newTokenId] = to;

        emit URI(arweaveID, newTokenId);
        return newTokenId;
    }

    function setTokenURI(uint256 tokenId, string memory newURI) external {
        require(
            _tokenOwners[tokenId] == msg.sender,
            "Not the owner of this token"
        );
        _tokenURIs[tokenId] = newURI;
        emit URI(newURI, tokenId);
    }

    function updateArweaveID(
        uint256 tokenId,
        string memory newArweaveID
    ) external {
        require(
            _tokenOwners[tokenId] == msg.sender,
            "Not the owner of this token"
        );
        _tokenURIs[tokenId] = newArweaveID;
        emit URI(newArweaveID, tokenId);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return _tokenOwners[tokenId];
    }
}
