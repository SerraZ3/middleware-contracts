// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2;

import "./Sensor.sol";

contract SensorBox{
    
    // Endereço da aplicação
    address public applicationWallet;
    
    // Identificador do sensor
    uint40 public idsb;
    
    // Endereço do dono
    address public owner;
    
    // Contratos dos sensores
    mapping(string=>Sensor) public sensors;
    
    uint8 public numberOfSensors = 0;

    // Cria a configuração inicial do sensor
    constructor(
        uint40 _idsb,
        address _applicationWallet,
        address _owner
    ) {
        applicationWallet = _applicationWallet;
        idsb = _idsb;
        owner = _owner;
    }
    function createSensor(string memory sensorName, MeasureSetting[] memory settingsMeasure) public  returns (Sensor addressContract){
        numberOfSensors++;
        sensors[sensorName] = new Sensor(sensorName, address(this), settingsMeasure,owner);
        return sensors[sensorName];
    }
    function insertMeasure(string memory sensorName, Measure[] memory newMeasure) public {
        sensors[sensorName].insertMeasure(newMeasure);
    }
    function getMeasure(string memory sensorName, uint position) public  view returns (Measure memory measure) {
        return sensors[sensorName].getMeasure(position);
    }
    function removeSensor(string memory sensorName) public {
        numberOfSensors--;
        delete sensors[sensorName];
    }
    
}