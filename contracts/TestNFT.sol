//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721 {
    uint256 private _nextTokenId;
    uint256 public constant TOKEN_PRICE = 0.00001 ether;

    constructor() ERC721("TestNFT", "TFT") {}

    /**
    @notice Mints an NFT to caller
     */
    function mint() external payable {
        require(msg.value >= TOKEN_PRICE, "INSUFFICIENT VALUE");
        _nextTokenId += 1;
        _safeMint(msg.sender, _nextTokenId);
    }
}
