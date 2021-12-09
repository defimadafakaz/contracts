
// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity 0.7.5;

import "hardhat/console.sol";

interface AggregatorV3Interface {

    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);

    // getRoundData and latestRoundData should both raise "No data present"
    // if they do not have data to report, instead of returning unset values
    // which could be misinterpreted as actual reported values.
    function getRoundData(uint80 _roundId)
    external
    view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
    function latestRoundData()
    external
    view
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

contract MockAggregator is AggregatorV3Interface {
    function decimals() external view override returns (uint8) {
        return 18;
    }
    function description() external view override returns (string memory) {
        return "mock aggregator";
    }
    function version() external view override returns (uint256) {
        return 1;
    }

    function latestRoundData()
    public
    view
    virtual
    override
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    )
    {
        return (1, 100000000, 10101010, 1010101, 1);
    }

    function getRoundData(uint80 _roundId)
    public
    view
    virtual
    override
    returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    )
    {
        return (1, 100000000, 10101010, 1010101, 1);
    }

}