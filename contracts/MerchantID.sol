// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./XP.sol";
import "./Compliant.sol";

/**
 * @title MerchantID
 * @dev This contract manages individual Merchant IDs as ERC-1155 tokens. Each merchant ID
 * has an associated Arweave ID, which can be updated by the owner of the merchant ID.
 */
contract MerchantID is ERC1155, Ownable {
    using Counters for Counters.Counter;

    // Counter for token IDs
    Counters.Counter private _tokenIds;

    // Mapping from token ID to its associated Arweave ID
    mapping(uint256 => string) private _arweaveIds;

    // Mapping from token ID to its owner
    mapping(uint256 => address) private _tokenOwners;

    // Reference to associated XP and Compliant contracts
    XP public xpContract;
    Compliant public compliantContract;

    // Event emitted when a merchant's Arweave ID is updated
    event UpdatedMerchantData(uint256 tokenId, string newURI);

    /**
     * @dev Constructor for initializing the MerchantID contract.
     * @param _xpAddress - address of the XP contract.
     * @param _compliantAddress - address of the Compliant contract.
     */
    constructor(address _xpAddress, address _compliantAddress) ERC1155("") {
        xpContract = XP(_xpAddress);
        compliantContract = Compliant(_compliantAddress);
    }

    /**
     * @dev Mints a new MerchantID token with the given Arweave ID.
     * @param to - address to which the new token will be minted.
     * @param arweaveID - associated Arweave ID for the new token.
     * @return Returns the ID of the newly minted token.
     */
    function mint(
        address to,
        string memory arweaveID
    ) external returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId, 1, "");
        _arweaveIds[newTokenId] = arweaveID;
        _tokenOwners[newTokenId] = to;

        return newTokenId;
    }

    /**
     * @dev Allows the owner of a token to update its associated Arweave ID.
     * @param tokenId - ID of the token to be updated.
     * @param newURI - new Arweave ID to be associated with the token.
     */
    function updateMerchantData(
        uint256 tokenId,
        string memory newURI
    ) external {
        require(_exists(tokenId), "Token does not exist");
        require(
            _tokenOwners[tokenId] == msg.sender,
            "Not the owner of this token"
        );
        _arweaveIds[tokenId] = newURI;
        emit UpdatedMerchantData(tokenId, newURI);
    }

    /**
     * @dev Returns the owner of a specific MerchantID token.
     * @param tokenId - ID of the token whose owner is to be returned.
     * @return Returns the address of the owner of the token.
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenOwners[tokenId];
    }

    /**
     * @dev Internal function to check if a token exists.
     * @param tokenId - ID of the token to be checked.
     * @return Returns true if the token exists, false otherwise.
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _tokenOwners[tokenId] != address(0);
    }

    /**
     * @dev Retrieves the Arweave ID associated with a specific MerchantID token.
     * @param tokenId - ID of the token whose Arweave ID is to be returned.
     * @return Returns the associated Arweave ID of the token.
     */
    function getMerchantData(
        uint256 tokenId
    ) public view returns (string memory) {
        return _arweaveIds[tokenId];
    }

    /**
     * @dev Allows the owner to withdraw ERC20 tokens sent to the contract.
     * @param token - IERC20 instance of the token to be withdrawn.
     * @param amount - amount of tokens to be withdrawn.
     */
    function withdrawERC20(IERC20 token, uint256 amount) external onlyOwner {
        require(token.transfer(owner(), amount), "Transfer failed");
    }
}
