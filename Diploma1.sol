pragma solidity ^0.4.24;
contract Diploma {
    address public contractOwner;
    address sendToAccount;
    string ipfsHash;
    string description;
    string active;
    uint16 eCTSCreditPoints;
    
    modifier onlyOwner {
        require(msg.sender == contractOwner, "Only owner can call this function.");
        _;
    }

    constructor(address _sendToAccount, string _ipfsHash, string _description, uint16 _eCTSCreditPoints) public {
        contractOwner = msg.sender;
        sendToAccount = _sendToAccount;
        ipfsHash = _ipfsHash;
        description = _description;
        eCTSCreditPoints = _eCTSCreditPoints;
        active = "true";
    }

    function setDiploma(string _ipfsHash, string _description, uint16 _eCTSCreditPoints) public onlyOwner {
        //if (msg.sender != contractOwner) { revert(); }
        ipfsHash = _ipfsHash;
        description = _description;
        eCTSCreditPoints = _eCTSCreditPoints;
    }
    function setActive(string _active) public onlyOwner {
        //if (msg.sender != contractOwner) { revert(); }
        active = _active;
    }

    function getDiploma() view public returns (address, string, string, string, uint16) {
        return (sendToAccount, ipfsHash, description, active, eCTSCreditPoints);
    }

}