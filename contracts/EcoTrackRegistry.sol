// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title A registry contract for Companies
/// @author Mr. Harsh Tyagi (MHT)
/// @notice You can use this contract to store and retrieve Company information
contract EcoTrackRegistry {
    
    // Struct to store Company information
    struct Company {
        string name;
        string industry;
    }

    // Mapping to store Company information against wallet addresses
    mapping(address => Company) public companies;

    // Event to emit when a new Company is added
    event CompanyAdded(address indexed wallet, string name, string industry);

    /// @notice Add a new Company to the registry
    /// @dev The Company name and industry are required
    /// @param _name The name of the Company
    /// @param _industry The industry of the Company
    /// @return void
    function setCompany(string memory _name, string memory _industry) public {
        companies[msg.sender] = Company(_name, _industry);
        emit CompanyAdded(msg.sender, _name, _industry);
    }

    /// @notice Get Company information by wallet address
    /// @dev The wallet address of the Company is required
    /// @param _wallet The wallet address of the Company
    /// @return name The name of the Company
    /// @return industry The industry of the Company
    function getCompany(address _wallet) public view returns (string memory, string memory) {
        Company memory company = companies[_wallet];
        return (company.name, company.industry);
    }
}
