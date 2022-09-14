// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./SimpleStorage.sol";

contract StorageFactory {

    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }

    function sfStore(uint256 __simpleStorageIndex, uint256 _simpleStorageNumber) public {
        simpleStorageArray[__simpleStorageIndex].store(_simpleStorageNumber);
    }

    function sfGet(uint256 __simpleStorageIndex) public view returns(uint256) {
        return simpleStorageArray[__simpleStorageIndex].retrieve();
    }
        
}