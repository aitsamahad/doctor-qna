const { UPLOAD_DOCTOR_PROFILE_PIC } = require("../handlers/upload");
const Models = require("../models");
const formidable = require("formidable");
const { isArray } = require("util");
const { Op } = require("sequelize");

module.exports = {
  getDoctorById: async (req, res, next, id) => {
    const doctor = await Models.Doctor.findOne({
      where: { d_id: id },
      include: [
        {
          model: Models.DOCTOR_PROFILE,
        },
      ],
    });

    const notifications = await Models.ToBeAnswered.findAndCountAll({
      where: { doctor_id: id, isActive: true },
    });

    if (!doctor)
      return res.status(400).json({
        error: "No Doctor found",
      });

    req.doctor = doctor;
    req.doctor.notifications = notifications;
    next();
  },

  getAllDoctors: async (req, res) => {
    const doctors = await Models.Doctor.findAll();
    if (doctors.length) {
      return res.status(200).json(doctors);
    }
  },

  toggleDoctorApproval: async (req, res) => {
    const doctor = await Models.Doctor.findOne({
      where: { d_id: req.doctor.d_id },
    });

    if (doctor) {
      doctor.update({ approved: !req.doctor.approved });
      return res.status(200).json({ error: false, message: "Doctor Toggled" });
    }
    return res.status(400).json({ error: true, message: "Some went wrong!" });
  },

  getDoctor: async (req, res) => {
    return res.json({
      doctor: req.doctor,
      notifications: req.doctor.notifications.count,
    });
  },

  getDoctorSpecificSpecializationQuestions: async (req, res) => {
    const { specializationId } = req.params;
    const specializationQuestions = await Models.Specialization.findOne({
      where: {
        id: specializationId,
      },
      include: [
        {
          model: Models.Question,
          include: [
            {
              model: Models.PATIENT_UPLOAD,
            },
            {
              model: Models.Answer,
            },
            {
              model: Models.ToBeAnswered,
              where: [
                {
                  doctor_id: req.doctor.d_id,
                  isActive: true,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!specializationQuestions)
      return res
        .status(400)
        .json({ error: "No Questions in this Specialization." });

    return res.status(200).json({ specializationQuestions });
  },

  getAllQuestionsFromSpecialization: async (req, res) => {
    const { specializationId } = req.params;
    const specializationQuestions = await Models.Specialization.findOne({
      where: {
        id: specializationId,
      },
      include: [
        {
          model: Models.Question,
          where: [
            {
              answered: {
                [Op.lte]: 4,
              },
            },
          ],
          include: [
            {
              model: Models.PATIENT_UPLOAD,
            },
            {
              model: Models.Answer,
            },
            {
              model: Models.ToBeAnswered,
            },
          ],
        },
      ],
    });

    if (!specializationQuestions)
      return res
        .status(400)
        .json({ error: "No Questions in this Specialization." });

    return res.status(200).json({ specializationQuestions });
  },

  getDoctorSpecificSpecializationAnsweredQuestions: async (req, res) => {
    const { specializationId } = req.params;
    const specializationQuestions = await Models.Specialization.findOne({
      where: {
        id: specializationId,
      },
      include: [
        {
          model: Models.Question,
          include: [
            {
              model: Models.PATIENT_UPLOAD,
            },
            {
              model: Models.Answer,
            },
            {
              model: Models.ToBeAnswered,
              where: [
                {
                  doctor_id: req.doctor.d_id,
                  isActive: false,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!specializationQuestions)
      return res
        .status(400)
        .json({ error: "No Answer in this Specialization." });

    return res.status(200).json({ specializationQuestions });
  },

  getDoctorAnsweredQuestionsForAllSpecializations: async (req, res) => {
    const notifications = await Models.Specialization.findAll({
      include: [
        {
          model: Models.ToBeAnswered,
          attributes: ["id", "patient_id"],
          where: [
            {
              doctor_id: req.doctor.d_id,
              isActive: false,
            },
          ],
        },
      ],
      attributes: ["id", "title"],
      required: true,
    });

    if (!notifications)
      return res.status(400).json({ error: "No Question answered by Doctor!" });

    const reConstructNotifications = [];

    notifications.map((notification) =>
      reConstructNotifications.push({
        id: notification.id,
        title: notification.title,
        Answered: notification.tobeanswereds,
        count: notification.tobeanswereds.length,
      })
    );

    return res.json(reConstructNotifications);
  },

  getDoctorSpecializationNotifications: async (req, res) => {
    const notifications = await Models.Specialization.findAll({
      include: [
        {
          model: Models.ToBeAnswered,
          attributes: ["id", "patient_id"],
          where: [
            {
              doctor_id: req.doctor.d_id,
              isActive: true,
            },
          ],
        },
      ],
      attributes: ["id", "title"],
      required: true,
    });

    if (!notifications)
      return res.status(400).json({ error: "No New Notifications!" });

    const reConstructNotifications = [];

    if (notifications.length) {
      notifications.map((notification) =>
        reConstructNotifications.push({
          id: notification.id,
          title: notification.title,
          notification: notification.tobeanswereds,
          count: notification.tobeanswereds.length,
        })
      );
      let spec = req.doctor.specializations.split(",");
      let customObj = [];
      for (const s of spec) {
        customObj.push({ title: { [Op.like]: "%" + s + "%" } });
      }
      const notify = await Models.Specialization.findAll({
        where: { [Op.or]: [...customObj] },
      });

      if (notify.length) {
        notify.map((not) => {
          let found = reConstructNotifications.some(
            (el) => el.title === not.title
          );
          if (!found) {
            reConstructNotifications.push({
              id: not.id,
              title: not.title,
              notification: [],
              count: 0,
            });
          }
        });
        return res.json(reConstructNotifications);
      }
    } else {
      let spec = req.doctor.specializations.split(",");
      let customObj = [];
      for (const s of spec) {
        customObj.push({ title: { [Op.like]: "%" + s + "%" } });
      }
      const notify = await Models.Specialization.findAll({
        where: { [Op.or]: [...customObj] },
      });

      let customResponse = [];

      if (notify.length) {
        notify.map((not) =>
          customResponse.push({ id: not.id, title: not.title, count: 0 })
        );
        return res.json(customResponse);
      }
    }
  },

  getAllSpecializationNotification: async (req, res) => {
    const notifications = await Models.Specialization.findAll({
      include: [
        {
          model: Models.ToBeAnswered,
          attributes: ["id", "patient_id"],
        },
        {
          model: Models.Question,
          where: [
            {
              answered: {
                [Op.lte]: 1,
              },
            },
          ],
        },
      ],
      attributes: ["id", "title"],
      required: true,
    });

    if (!notifications)
      return res.status(400).json({ error: "No New Notifications!" });

    const reConstructNotifications = [];

    notifications.map((notification) =>
      reConstructNotifications.push({
        id: notification.id,
        title: notification.title,
        notification: notification.tobeanswereds,
        count: notification.tobeanswereds.length,
      })
    );

    return res.json(reConstructNotifications);
  },

  postAnswer: async (req, res) => {
    const { patient_id, question_id, specialization_id, answer } = req.body;

    const { question } = req.body || "none";

    const PostAnswer = await Models.Answer.create({
      patient_id,
      question_id,
      question,
      doctor_id: req.doctor.d_id,
      specialization_id,
      answer,
    });

    const UpdateToBeAnswered = await Models.ToBeAnswered.findOne({
      where: {
        doctor_id: req.doctor.d_id,
        question_id: question_id,
      },
    });

    await UpdateToBeAnswered.update({
      isActive: false,
    });

    if (!PostAnswer)
      return res
        .status(400)
        .json({ error: true, message: "Not able to post the answer!" });

    return res.json({ error: false, message: "Answer Posted!" });
  },

  clearDoctors: async (req, res) => {
    await Models.Doctor.destroy({
      where: {},
      truncate: true,
      cascade: true,
    });
    res.json({ message: "Doctor's table has been cleared!" });
  },

  updateDoctor: async (req, res) => {
    // De-structuring information from the req
    const { office_timing, office_address, phone, about } = req.body;

    await Models.Doctor.findOne({
      where: { d_id: req.doctor.d_id },
    })
      .then(async (result) => {
        const updated = await result.update({
          office_timing,
          office_address,
          phone,
          about,
        });
        res.json({ updated: true });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(400)
          .json({ updated: false, message: "Not able to update!" });
      });
  },

  updateDoctorFCM: async (req, res) => {
    const { fcm_token } = req.body;

    const doctor = await Models.Doctor.findOne({
      where: { d_id: req.doctor.d_id },
    });

    if (!doctor)
      return res
        .status(400)
        .json({ updated: false, message: "Not able to update FCM!" });

    await doctor.update({
      fcm_token: fcm_token,
    });

    return res.json({
      updated: true,
      message: "FCM Updated!",
    });
  },

  doctorLogin: async (req, res) => {
    const doctor = await Models.Doctor.findOne({
      where: { d_id: req.doctor.d_id },
    });

    if (!doctor)
      return res.status(400).json({ error: true, message: "Doctor not found" });

    await doctor.update({
      isSignedIn: 1,
    });

    res.json({ error: false, message: "Doctor Login successful!" });
  },

  doctorLogout: async (req, res) => {
    const doctor = await Models.Doctor.findOne({
      where: { d_id: req.doctor.d_id },
    });

    if (!doctor)
      return res.status(400).json({ error: true, message: "Doctor not found" });

    await doctor.update({
      isSignedIn: 0,
    });

    res.json({ error: false, message: "Doctor Log out successfully!" });
  },

  addDoctorProfileImage: async (req, res) => {
    let form = new formidable.IncomingForm({ multiples: true });
    form.keepExtensions = true;

    await form.parse(req, (err, fields, { uploads }) => {
      (async function () {
        // Checking if there are images in the fields and uploading them
        if (isArray(uploads)) {
          uploads.map((file) => UPLOAD_DOCTOR_PROFILE_PIC(file, fields.d_id));
        } else if (uploads) {
          UPLOAD_DOCTOR_PROFILE_PIC(uploads, fields.d_id);
        }

        if (err)
          return res.status(400).json({
            error: true,
            message: "Masla yeh hai!, " + err,
          });

        return res.status(201).json({
          error: false,
          message: "Profile picture uploaded successfully!",
        });
      })();
    });
  },
};
