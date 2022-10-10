// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

// Gas cost 837,437 - Original
// Gas cost 817,443 - Constant
// Gas cost 813,954 - Immuatable
// Gas cost 794,008 - Constant and Immutable
// Gas cost 715,218 - Constant, Immutable and Error Handling

error FundMe__NotOwner();
error FundMe__NotEnoughEth();

/// @title A contract from crowdfunding or donations
/// @author Nathan Moudakis
/// @notice This contract is a funding  contract
/// @dev This implements price feeds as our library
contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 10 * 10**8;
    // Gas cost 21,371 - constant
    // Gas cost 23,471 - no-constant

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public immutable i_owner;
    // Gas cost 21,508 - immutable
    // Gas cost 23,622 - not-immutable

    AggregatorV3Interface public priceFeed;

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /// @notice This function funds the contract
    /// @dev This function is executed by running against the ETHUSD chainlink oracle to get a minimum price of $10
    function fund() public payable {
        if (msg.value.getConversionRate(priceFeed) < MINIMUM_USD) {
            revert FundMe__NotEnoughEth();
        }
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    /// @notice This function allows the owner to withdrawn funds from the contract
    /// @dev This functions iterates through the funders to update a map reseting the funding balance
    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }
}
