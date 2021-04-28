// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2;

import "./Application.sol";

contract Middleware{
    
    // Aplicações
    mapping(uint40=>Application) public applications;
    
    // Owner middleware    
    address public owner;
    
    uint8 public numberOfApplication = 0;
    
    // Cria a configuração inicial do middleware
    constructor() {
        owner = msg.sender;
    }
    function createApplication(uint40 ida) public returns (Application addressContract){
        numberOfApplication++;
        applications[ida] = new Application(ida, address(this), msg.sender);
        return applications[ida];
    }
    function createSensorBox(uint40 ida, uint40  idsb) public  returns (SensorBox addressContract){
         return applications[ida].createSensorBox(idsb);
    }
    function createSensor(uint40 ida, uint40  idsb, string memory sensorName, MeasureSetting[] memory settingsMeasure) public  returns (Sensor addressContract){
        return applications[ida].createSensor(idsb,sensorName,settingsMeasure);
    }
    function removeApplication(uint40 ida) public{
        numberOfApplication--;
        applications[ida] = new Application(ida, address(this), msg.sender);
    }
}