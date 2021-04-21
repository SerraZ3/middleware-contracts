// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;
pragma abicoder v2;

import "./sensorBox.sol";

contract Application{
    
    // Endereço do middleware
    address public middlewareWallet;
    
    // Endereço do dono
    address public ownerWallet;
    
    // Identificador da aplicação
    uint40 public ida;
    
    // Contratos dos sensores
    mapping(uint40=>SensorBox) public sensorBox;
    
    uint8 public numberOfSensorBox = 0;
    
    // Cria a configuração inicial da aplicação
    constructor(
        uint40 _ida,
        address _middlewareWallet,
        address _ownerWallet
    ) {
        middlewareWallet = _middlewareWallet;
        ownerWallet = _ownerWallet;
        ida = _ida;
    }
    
    function createSensorBox( uint40  idsb) public{
        numberOfSensorBox++;
        sensorBox[idsb] = new SensorBox(idsb, address(this));
    }
    function removeSensorBox( uint40  idsb) public{
        numberOfSensorBox--;
        sensorBox[idsb] = new SensorBox(idsb, address(this));
    }

}