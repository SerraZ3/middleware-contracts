// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma abicoder v2;

// Estrutura da configuração de medição
struct MeasureSetting{
    string idv;
    uint8 decimalPlace;
    uint defaultValue;
    uint max;
    uint min;
}
// Estrutura de medição
struct Measure{
    uint[] value;
    uint64 timestamp;
}

contract Sensor{
    
    // Endereço do sensorBox
    address public sensorBoxWallet;
    
    // Nome do sensor
    string public name;
    
    // Aceita diversas configurações
    MeasureSetting[] settings;

    // Dados de medições
    Measure[] measures;
    
     // Endereço do dono
    address public owner;
    
    // Cria a configuração inicial do sensor
    constructor(
        string memory _name,
        address _sensorBoxWallet,
        MeasureSetting[] memory _settings,
        address _owner
    ) {
        require(_settings.length > 0, "Settings empty");
        sensorBoxWallet = _sensorBoxWallet;
        name = _name;
        owner = _owner;
        for(uint8 i; i<_settings.length;i++){
            settings.push(_settings[i]);
        }
    }
    // Cadastra as medições
    function insertMeasure(Measure[] memory newMeasure) public {
        for(uint i; i < newMeasure.length; i++){
            require(newMeasure[i].value.length == settings.length, "SettingsSize is different of new measure value");
            measures.push(newMeasure[i]);
        }
    }
    // Pega a medição pela posição
    function getMeasure(uint position) public  view returns (Measure memory measure) {
        require(measures.length > 0, "Measures empty");
        require(measures.length > position, "Position larger than measure size");
        return measures[position];
    }
    // Pega a configuração de medição pela posição
    function getSettingMeasure(uint position) public  view returns (MeasureSetting memory settingMeasure) {
        require(settings.length > 0, "Measure settings empty");
        require(settings.length > position, "Position larger than measure settings size");
        return settings[position];
    }
    // Retorna o total de medições
    function getTotalMeasure() public  view returns (uint sizeMeasure){
        return measures.length;
    }
    // Retorna o total de configurações
    function getTotalMeasureSetting()public  view returns (uint sizeMeasureSetting){
        return settings.length;
    }

}