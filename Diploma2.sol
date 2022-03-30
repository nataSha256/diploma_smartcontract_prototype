pragma solidity ^0.4.24;
contract InstitutionCertificates {
    address public contractOwner;
    uint public lastID;
    struct Certificate  {
        address sendToAccount;
        string ipfsHash;
        string description;
        string active;
        uint16 eCTSCreditPoints;
    }
    mapping (uint => Certificate) certificates;
    uint[] public certificateAccounts;
    
    modifier onlyOwner {
        require(msg.sender == contractOwner, "Only owner can call this function.");
        _;
    }

    constructor() public {
        contractOwner = msg.sender;
    }
    
    function newCertificate(address _sendToAccount, string _ipfsHash, string _description, uint16 _eCTSCreditPoints) public onlyOwner {
        //if (msg.sender != contractOwner) { revert(); }
        lastID = lastID + 1;
        Certificate l_certificate;
        l_certificate = certificates[lastID];
        l_certificate.sendToAccount = _sendToAccount;
        l_certificate.ipfsHash = _ipfsHash;
        l_certificate.description = _description;
        l_certificate.active = "true";
        l_certificate.eCTSCreditPoints = _eCTSCreditPoints;
        certificateAccounts.push(lastID) -1;
    }

    function setCertificate(uint _ID, address _sendToAccount, string _ipfsHash, string _description, uint16 _eCTSCreditPoints) public onlyOwner {
        //if (msg.sender != contractOwner) { revert(); }
        Certificate l_certificate;
        l_certificate = certificates[_ID];
        l_certificate.sendToAccount = _sendToAccount;
        l_certificate.ipfsHash = _ipfsHash;
        l_certificate.description = _description;
        l_certificate.eCTSCreditPoints = _eCTSCreditPoints;
    }

    function setActive(uint _ID, string _active) public onlyOwner {
        //if (msg.sender != contractOwner) { revert(); }
        Certificate l_certificate;
        l_certificate = certificates[_ID];
        l_certificate.active = _active;
    }

    function getCertificate(uint _ID) view public returns (address, string, string, string, uint16) {
        return (certificates[_ID].sendToAccount,
                certificates[_ID].ipfsHash,
                certificates[_ID].description,
                certificates[_ID].active,
                certificates[_ID].eCTSCreditPoints);
        }
}