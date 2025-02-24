// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateTransparency {
    address public owner;

    struct Certificate {
        string domain;
        string issuer;
        uint256 timestamp;
        bool isRevoked;
    }

    mapping(bytes32 => Certificate) public certificates;
    event CertificateIssued(bytes32 indexed certHash, string domain, string issuer, uint256 timestamp);
    event CertificateRevoked(bytes32 indexed certHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(string memory domain, string memory issuer) public onlyOwner {
        bytes32 certHash = keccak256(abi.encodePacked(domain, issuer, block.timestamp));
        certificates[certHash] = Certificate(domain, issuer, block.timestamp, false);
        emit CertificateIssued(certHash, domain, issuer, block.timestamp);
    }

    function revokeCertificate(bytes32 certHash) public onlyOwner {
        require(certificates[certHash].timestamp != 0, "Certificate does not exist");
        certificates[certHash].isRevoked = true;
        emit CertificateRevoked(certHash);
    }
}