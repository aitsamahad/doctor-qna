const fs = require("fs");
const path = require("path");
const shortid = require("shortid");
const mkdirp = require("mkdirp");
const Models = require("../models");

module.exports = {
  UPLOAD_DOCTOR_ID: (file, d_id) => {
    const ID_UPLOAD = Models.ID_UPLOAD;
    const { name, type } = file;

    // Ensure upload directory exists.
    const UPLOAD_DIR = path.join(__dirname, "../uploads") + "/doctors/" + d_id;
    mkdirp.sync(UPLOAD_DIR);

    let id = shortid.generate();
    let oldPath = file.path;
    let newPath = `${UPLOAD_DIR}/${id}-${file.name}`;
    let uploadPath = `/uploads/doctors/${d_id}/${id}-${file.name}`;
    let rawData = fs.readFileSync(oldPath);

    fs.writeFile(newPath, rawData, function (err) {
      if (err) console.log(err);
      ID_UPLOAD.create({
        d_id: d_id,
        filename: id + "-" + name,
        mimetype: type,
        path: uploadPath,
      });
      return true;
    });
    return false;
  },

  UPLOAD_DOCTOR_PROFILE_PIC: (file, d_id) => {
    const DOCTOR_PROFILE_PIC = Models.DOCTOR_PROFILE;
    const { name, type } = file;

    // Ensure upload directory exists.
    const UPLOAD_DIR =
      path.join(__dirname, "../uploads") + "/doctors/" + d_id + "/profile";
    mkdirp.sync(UPLOAD_DIR);

    let id = shortid.generate();
    let oldPath = file.path;
    let newPath = `${UPLOAD_DIR}/${id}-${file.name}`;
    let uploadPath = `/uploads/doctors/${d_id}/profile/${id}-${file.name}`;
    let rawData = fs.readFileSync(oldPath);

    fs.writeFile(newPath, rawData, function (err) {
      if (err) console.log(err);
      DOCTOR_PROFILE_PIC.create({
        d_id: d_id,
        filename: id + "-" + name,
        mimetype: type,
        path: uploadPath,
      });
      return true;
    });
    return false;
  },

  UPLOAD_PATIENT_PROFILE_PIC: (file, p_id) => {
    const PATIENT_PROFILE_PIC = Models.PATIENT_PROFILE;
    const { name, type } = file;

    // Ensure upload directory exists.
    const UPLOAD_DIR =
      path.join(__dirname, "../uploads") + "/patients/" + p_id + "/profile";
    mkdirp.sync(UPLOAD_DIR);

    let id = shortid.generate();
    let oldPath = file.path;
    let newPath = `${UPLOAD_DIR}/${id}-${file.name}`;
    let uploadPath = `/uploads/patients/${d_id}/profile/${id}-${file.name}`;
    let rawData = fs.readFileSync(oldPath);

    fs.writeFile(newPath, rawData, function (err) {
      if (err) console.log(err);
      PATIENT_PROFILE_PIC.create({
        p_id: p_id,
        filename: id + "-" + name,
        mimetype: type,
        path: uploadPath,
      });
      return true;
    });
    return false;
  },

  UPLOAD_PATIENT_DOCS: (file, p_id, question_id) => {
    const PATIENT_UPLOAD = Models.PATIENT_UPLOAD;
    const { name, type } = file;

    // Ensure upload directory exists.
    const UPLOAD_DIR =
      path.join(__dirname, "../uploads") +
      "/patients/" +
      p_id +
      "/questions/" +
      question_id;
    mkdirp.sync(UPLOAD_DIR);

    let id = shortid.generate();
    let oldPath = file.path;
    let newPath = `${UPLOAD_DIR}/${id}-${file.name}`;
    let uploadPath = `/uploads/patients/${p_id}/questions/${question_id}/${id}-${file.name}`;
    let rawData = fs.readFileSync(oldPath);

    fs.writeFile(newPath, rawData, function (err) {
      if (err) console.log(err);
      PATIENT_UPLOAD.create({
        p_id: p_id,
        question_id: question_id,
        filename: id + "-" + name,
        mimetype: type,
        path: uploadPath,
      });
      return true;
    });
    return false;
  },
};
