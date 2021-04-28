// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2;

import "./SensorBox.sol";

contract Application{
    
    // Endereço do middleware
    address public middlewareWallet;
    
    // Endereço do dono
    address public owner;
    
    // Identificador da aplicação
    uint40 public ida;
    
    // Contratos dos sensores
    mapping(uint40=>SensorBox) public sensorBox;
    
    uint8 public numberOfSensorBox = 0;
    
    // Cria a configuração inicial da aplicação
    constructor(
        uint40 _ida,
        address _middlewareWallet,
        address _owner
    ) {
        middlewareWallet = _middlewareWallet;
        owner = _owner;
        ida = _ida;
    }
    
    function createSensorBox( uint40  idsb) public returns (SensorBox addressContract){
        numberOfSensorBox++;
        sensorBox[idsb] = new SensorBox(idsb, address(this), owner);
        return sensorBox[idsb];
    }
    function createSensor(uint40  idsb, string memory sensorName, MeasureSetting[] memory settingsMeasure) public  returns (Sensor addressContract){
        return sensorBox[idsb].createSensor(sensorName,settingsMeasure);
    }
    function removeSensorBox( uint40  idsb) public{
        numberOfSensorBox--;
        delete sensorBox[idsb];
    }

}