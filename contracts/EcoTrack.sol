//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EcoTrack {
    // Enum to represent categories of sustainability data
    enum SustainabilityCategory { LOW, MEDIUM, HIGH }

    // Structure to hold sustainability data for a company
    struct SustainabilityData {
        SustainabilityCategory emissionsCategory; // Category of emissions
        SustainabilityCategory wasteCategory; // Category of waste
        bytes proof; // Flag indicating if data is verified
        bytes[] publicInputs;
        bool status;
    }

    // Mapping from company address to its sustainability data
    mapping(address => SustainabilityData) public sustainabilityRecords;

    // Event emitted when sustainability data is submitted and recorded
    event SustainabilityDataSubmitted(address indexed company, SustainabilityCategory emissionsCategory, SustainabilityCategory wasteCategory);

    // Function to submit sustainability data
    function submitSustainabilityData(SustainabilityCategory _emissionsCategory, SustainabilityCategory _wasteCategory, bytes calldata _proof, bytes[] calldata _publicInputs) external {
        
        // Ensure data is not already submitted
        require(!sustainabilityRecords[msg.sender].status, "Data already submitted");

        // Record sustainability data for the company
        sustainabilityRecords[msg.sender] = SustainabilityData(_emissionsCategory, _wasteCategory, _proof, _publicInputs, true);

        // Emit event
        emit SustainabilityDataSubmitted(msg.sender, _emissionsCategory, _wasteCategory);
    }

    // Function to get sustainability data for a company
    function getSustainabilityData(address _company) external view returns (SustainabilityCategory, SustainabilityCategory, bytes memory, bytes[] memory,bool) {
        return (
            sustainabilityRecords[_company].emissionsCategory,
            sustainabilityRecords[_company].wasteCategory,
            sustainabilityRecords[_company].proof,
            sustainabilityRecords[_company].publicInputs,
            sustainabilityRecords[_company].status

        );
    }
}
