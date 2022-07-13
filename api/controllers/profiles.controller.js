const groupBy = require("lodash.groupby");

let profilesDataSet = require("../data/profile.data.json");

exports.getProfiles = () => profilesDataSet;

exports.getSalaries = (profiles) => profiles.map((item) => item.salary);

exports.getFilteredProfiles = (key, value, profiles = profilesDataSet) => {
  return profiles.filter((profile) => profile[key] === value);
};

exports.getGroupedProfiles = (key, profiles = profilesDataSet) => {
  return groupBy(profiles, key);
};

exports.filterProfiles = (options) => {
  let filteredProfiles = this.getProfiles();

  if (options.isOnContract) {
    filteredProfiles = this.getFilteredProfiles(
      "on_contract",
      "true",
      filteredProfiles
    );
  }

  if (options.isByDepartment || options.isBySubDepartment) {
    filteredProfiles = this.getGroupedProfiles("department", filteredProfiles);
  }

  if (options.isBySubDepartment) {
    Object.keys(filteredProfiles).forEach((key) => {
      let group = filteredProfiles[key];
      const subGroup = this.getGroupedProfiles("sub_department", group);
      filteredProfiles[key] = subGroup;
    });
  }

  return Array.isArray(filteredProfiles)
    ? { All: filteredProfiles }
    : filteredProfiles;
};

exports.getAllProfiles = (req, res) => {
  const profiles = this.getProfiles();
  res.status(200).json({
    status: 200,
    message: `${profiles.length} items found!`,
    payload: profiles,
  });
};

exports.addProfile = (req, res) => {
  const newProfile = req.body;
  const profile = this.getFilteredProfiles("name", newProfile.name);
  if (profile.length === 0) {
    profilesDataSet.push(newProfile);
    res.status(201).json({
      status: 201,
      message: "Profile successfully created!",
      payload: null,
    });
    return;
  }

  res.status(409).json({
    status: 409,
    message: "Profile with this name already exists...",
    payload: profile[0],
  });
};

exports.deleteProfileByName = (req, res) => {
  const name = req.params.name;
  const profileToDelete = this.getFilteredProfiles("name", name);
  if (profileToDelete.length) {
    profilesDataSet = profilesDataSet.filter((profile) => profile.name != name);
    res.status(200).json({
      status: 200,
      message: "Profile successfully deleted!",
      payload: null,
    });
    return;
  }

  res.status(404).json({
    status: 404,
    message: "Profile not found",
    payload: null,
  });
};
