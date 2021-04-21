// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;
pragma abicoder v2;

import "./sensor.sol";

contract SensorBox{
    
    // Endereço da aplicação
    address public applicationWallet;
    
    // Identificador do sensor
    uint40 public idsb;
    
    // Contratos dos sensores
    mapping(string=>Sensor) public sensors;
    
    uint8 public numberOfSensors = 0;

    // Cria a configuração inicial do sensor
    constructor(
        uint40 _idsb,
        address _applicationWallet
    ) {
        applicationWallet = _applicationWallet;
        idsb = _idsb;
    }
    function createSensor(string memory sensorName, MeasureSetting[] memory settingsMeasure) public{
        numberOfSensors++;
        sensors[sensorName] = new Sensor(sensorName, address(this), settingsMeasure);
    }
    function removeSensor(string memory sensorName) public{
        numberOfSensors--;
        delete sensors[sensorName];
    }
}