module.exports = {
  validTimestamp: (timestamp) => {
    let timestamp2Response = null;

    // If is number.
    if (!isNaN(timestamp)) {
      // Convert to integer
      timestamp = parseInt(timestamp);
      // If timestamp was completed
      // The ending ends with 000
      if (timestamp % 0 !== 0) {
        timestamp = timestamp * 1000;
      }
      // timestamp converted object Date with hours zero
      let checkDate = new Date(timestamp).setHours(0, 0, 0, 0);
      // Object Date now with hours zero
      let currently = new Date().setHours(0, 0, 0, 0);

      // Check date equality
      if (checkDate !== currently) {
        timestamp2Response = new Date();
      }
    }
    // Check date was valid
    else if (new Date(timestamp) === NaN) {
      timestamp2Response = new Date();
    } else {
      // timestamp converted object Date with hours zero
      let checkDate = new Date(timestamp).setHours(0, 0, 0, 0);
      // Object Date now with hours zero
      let currently = new Date().setHours(0, 0, 0, 0);
      // Check date equality
      if (checkDate !== currently) {
        timestamp2Response = new Date();
      }
    }
    return { timestamp, timestamp2Response };
  },
};
