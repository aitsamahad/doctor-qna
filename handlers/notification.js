const Models = require("../models");
const { Op } = require("sequelize");
const FCM = require("firebase-admin");

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
        let DoctorsFCMTokens = [];
        for (const doc of GetAllSpecializedDoctors) {
          console.log(doc.d_id);
          let notify = {
            patient_id,
            question_id,
            doctor_id: doc.d_id,
            specialization_id,
          };
          DoctorsNotificationList.push(notify);
          DoctorsFCMTokens.push(doc.fcm_token);
        }

        // Sending FCM Notification
        if (DoctorsFCMTokens.length > 0) {
          FCM.messaging()
            .sendMulticast({
              tokens: DoctorsFCMTokens,
              notification: {
                title: "Doctor's Q&A",
                body: "Patient needs you!",
              },
              data: {
                title: "Doctor's Q&A",
                body: "Patient needs you!",
                type: "answerList",
              },
              android: {
                notification: {
                  click_action: "OPEN_ACTIVITY_1",
                },
              },
              apns: {
                headers: {
                  "apns-priority": "5",
                },
                payload: {
                  aps: {
                    category: "NEW_MESSAGE_CATEGORY",
                  },
                },
              },
              webpush: {
                headers: {
                  TTL: "86400",
                },
              },
            })
            .then((response) => {
              if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                  if (!resp.success) {
                    failedTokens.push(registrationTokens[idx]);
                  }
                });
                console.log(
                  "List of tokens that caused failures: " + failedTokens
                );
              }
              // Response is a message ID string.
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });
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
