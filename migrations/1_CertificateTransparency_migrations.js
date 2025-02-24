const CertificateTransparency = artifacts.require("CertificateTransparency");

module.exports = function (deployer) {
  deployer.deploy(CertificateTransparency);
};