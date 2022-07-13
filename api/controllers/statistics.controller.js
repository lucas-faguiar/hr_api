const profilesController = require("./profiles.controller");

const getMeanSalary = (salaries) =>
  salaries.reduce((total, cur, i, arr) => total + cur / arr.length, 0);
const getMinSalary = (salaries) => Math.min(...salaries);
const getMaxSalary = (salaries) => Math.max(...salaries);

const calculateStatistics = (salaries) => {
  return {
    mean: getMeanSalary(salaries),
    min: getMinSalary(salaries),
    max: getMaxSalary(salaries),
  };
};

const processRecursiveGroupStatistic = (profiles) => {
  return Object.keys(profiles).map((key) => {
    let group = profiles[key];

    if (Array.isArray(group)) {
      const salaries = profilesController.getSalaries(group);
      const statistics = calculateStatistics(salaries);

      const innerResult = {};
      innerResult[key] = statistics;
      return innerResult;
    }

    const result = {};
    result[key] = processRecursiveGroupStatistic(group);
    return result;
  });
};

exports.getStatistics = (req, res) => {
  // Get query params
  const isOnContract = !!req.query["onContract"];
  const isByDepartment = !!req.query["byDepartment"];
  const isBySubDepartment = !!req.query["bySubDepartment"];

  // Filter data
  const options = { isOnContract, isByDepartment, isBySubDepartment };
  const filteredProfiles = profilesController.filterProfiles(options);

  // Get statistics
  const groupStatistics = processRecursiveGroupStatistic(filteredProfiles);

  // Send response
  if (!groupStatistics.length) {
    res.status(404).json({
      status: 404,
      message: "No profiles found to calculate statistics...",
      payload: groupStatistics,
    });
    return;
  }

  res.status(200).json({
    status: 200,
    message: "Statistics successfully calculated!",
    payload: groupStatistics,
  });
};
