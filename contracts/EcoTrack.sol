//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EcoTrack {
    // Enum to represent categories of sustainability data
    enum SustainabilityCategory { LOW, MEDIUM, HIGH }

    // Structure to hold sustainability data for a company
    struct SustainabilityData {
        string companyName; // Name of the company
        string companyRegNo; // Registration number of the company
        SustainabilityCategory emissionsCategory; // Category of emissions
        bytes proof; // Flag indicating if data is verified
        bytes[] publicInputs;
        bool status;
    }

    // Mapping from company address to its sustainability data
    mapping(address => SustainabilityData) public sustainabilityRecords;

    // Event emitted when sustainability data is submitted and recorded
    event SustainabilityDataSubmitted(address indexed company, SustainabilityCategory emissionsCategory);

    // Function to submit sustainability data
    function submitSustainabilityData(string memory _companyName, string memory _companyRegNo, SustainabilityCategory _emissionsCategory, bytes calldata _proof, bytes[] calldata _publicInputs) external {
        
        // Ensure data is not already submitted
        require(!sustainabilityRecords[msg.sender].status, "Data already submitted");

        // Record sustainability data for the company
        sustainabilityRecords[msg.sender] = SustainabilityData(_companyName, _companyRegNo,_emissionsCategory, _proof, _publicInputs, true);

        // Emit event
        emit SustainabilityDataSubmitted(msg.sender, _emissionsCategory);
    }

    // Function to get sustainability data for a company
    function getSustainabilityData(address _company) external view returns (string memory, string memory,SustainabilityCategory, bytes memory, bytes[] memory,bool) {
        return (
            sustainabilityRecords[_company].companyName,
            sustainabilityRecords[_company].companyRegNo,
            sustainabilityRecords[_company].emissionsCategory,
            sustainabilityRecords[_company].proof,
            sustainabilityRecords[_company].publicInputs,
            sustainabilityRecords[_company].status

        );
    }
}
