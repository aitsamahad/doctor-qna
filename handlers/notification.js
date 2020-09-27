const Models = require("../models");
const { Op } = require("sequelize");

module.exports = {
  SEND_NOTIFICATION_TO_DOCTOR: async (
    patient_id,
    question_id,
    specialization_id
  ) => {
    const GetSpecializationName = await Models.Specialization.findOne({
      where: { id: specialization_id },
      attributes: ["title"],
    });
    if (GetSpecializationName) {
      const GetAllSpecializedDoctors = await Models.Doctor.findAll({
        where: {
          specializations: {
            [Op.like]: "%" + GetSpecializationName.title + "%",
          },
        },
      });
      if (GetAllSpecializedDoctors.length > 0) {
        let DoctorsNotificationList = [];
        for (const doc of GetAllSpecializedDoctors) {
          console.log(doc.d_id);
          let notify = {
            patient_id,
            question_id,
            doctor_id: doc.d_id,
            specialization_id,
          };
          DoctorsNotificationList.push(notify);
        }

        const SendNotification = await Models.ToBeAnswered.bulkCreate(
          DoctorsNotificationList,
          { returning: true }
        );

        if (SendNotification) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
};
