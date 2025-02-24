// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateTransparency {
    // Mapping để lưu trữ chứng chỉ
    mapping(address => uint256[]) public certificateMap;

    // Sự kiện để thông báo khi một chứng chỉ được thêm
    event CertificateAdded(address indexed owner, uint256 certificateId);

    constructor() {}
        // Thêm chứng chỉ mới vào blockchain
    function addCertificate(uint256 certificateId) public {
        require(certificateId != 0, "Certificate ID must be valid");  // Kiểm tra ID hợp lệ

        certificateMap[msg.sender].push(certificateId);  // Lưu vào danh sách của người gửi

        emit CertificateAdded(msg.sender, certificateId);  // Gửi sự kiện
    }

    // Hàm để lấy danh sách chứng chỉ của một địa chỉ
    function getCertificates(address owner) public view returns (uint256[] memory) {
        return certificateMap[owner];
    }
}
