-- CREATE DATABASE middleware;

-- Cria trigger para atualizar automaticamente o campo de updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TYPE STORAGE_TYPE AS ENUM ('average', 'unit', 'by_size');

CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  email VARCHAR(200) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

CREATE TABLE IF NOT EXISTS applications(
  id SERIAL PRIMARY KEY,
  ida BIGINT UNIQUE NOT NULL,
  auth VARCHAR(100) UNIQUE NOT NULL,
  user_id SERIAL NOT NULL,
  contract_id SERIAL NOT NULL,
  contract_setting_id SERIAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

CREATE TABLE IF NOT EXISTS sensor_boxes(
  id SERIAL PRIMARY KEY,
  idsb BIGINT UNIQUE NOT NULL,
  url varchar(200) NOT NULL,
  location point,
  application_id SERIAL NOT NULL,
  contract_id SERIAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

CREATE TABLE IF NOT EXISTS sensor_boxes_sensors(
  id SERIAL PRIMARY KEY,
  sensor_box_id SERIAL NOT NULL,
  sensor_id SERIAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

CREATE TABLE IF NOT EXISTS sensors(
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  value JSON NOT NULL,
  contract_id SERIAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

CREATE TABLE IF NOT EXISTS readings(
  id SERIAL PRIMARY KEY,
  value JSON NOT NULL,
  sensor_box_sensor_id SERIAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

CREATE TABLE IF NOT EXISTS contracts(
  id SERIAL PRIMARY KEY,
  address VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 
CREATE TABLE IF NOT EXISTS wallets(
  id SERIAL PRIMARY KEY,
  address VARCHAR(100) NOT NULL UNIQUE,
  crypto JSON NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

CREATE TABLE IF NOT EXISTS captures(
  id SERIAL PRIMARY KEY,
  status BOOLEAN NOT NULL default false,
  type VARCHAR(30) NOT NULL,
  idt BIGINT UNIQUE NOT NULL,
  sensor_box_id SERIAL NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 
CREATE TABLE IF NOT EXISTS contract_settings(
  id SERIAL PRIMARY KEY,
  data_size INTEGER NOT NULL default 10,
  period VARCHAR(20) NOT NULL,
  last_reading TIMESTAMPTZ,
  next_reading TIMESTAMPTZ,
  storage_type STORAGE_TYPE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 

ALTER TABLE applications 
  ADD CONSTRAINT fk_applications_contracts
  FOREIGN KEY (contract_id) 
  REFERENCES contracts(id);

ALTER TABLE applications 
  ADD CONSTRAINT fk_applications_users
  FOREIGN KEY (user_id) 
  REFERENCES users(id);

ALTER TABLE applications 
  ADD CONSTRAINT fk_applications_contract_settings
  FOREIGN KEY (contract_setting_id) 
  REFERENCES contract_settings(id);

ALTER TABLE sensor_boxes 
  ADD CONSTRAINT fk_sensor_boxes_applications
  FOREIGN KEY (application_id) 
  REFERENCES applications(id);

ALTER TABLE sensor_boxes 
  ADD CONSTRAINT fk_sensor_boxes_contracts
  FOREIGN KEY (contract_id) 
  REFERENCES contracts(id);

ALTER TABLE sensor_boxes_sensors
  ADD CONSTRAINT fk_sensor_boxes_sensors_sensor_box
  FOREIGN KEY (sensor_box_id) 
  REFERENCES sensor_boxes(id);

ALTER TABLE sensor_boxes_sensors
  ADD CONSTRAINT fk_sensor_boxes_sensors_sensors
  FOREIGN KEY (sensor_id) 
  REFERENCES sensors(id);

ALTER TABLE sensors
  ADD CONSTRAINT fk_sensors_contracts
  FOREIGN KEY (contract_id) 
  REFERENCES contracts(id);

ALTER TABLE readings
  ADD CONSTRAINT fk_readings_sensor_boxes_sensors
  FOREIGN KEY (sensor_box_sensor_id) 
  REFERENCES sensor_boxes_sensors(id);

ALTER TABLE captures
  ADD CONSTRAINT fk_captures_sensor_boxes
  FOREIGN KEY (sensor_box_id) 
  REFERENCES sensor_boxes(id);

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns WHERE column_name = 'updated_at'
    LOOP
        EXECUTE format('CREATE TRIGGER trigger_update_timestamp
                    BEFORE UPDATE ON %I
                    FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp()', t,t);
    END loop;
END;
$$ language 'plpgsql';