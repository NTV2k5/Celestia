const CertificateTransparency = artifacts.require("CertificateTransparency");

module.exports = async function (deployer) {
  await deployer.deploy(CertificateTransparency);
};