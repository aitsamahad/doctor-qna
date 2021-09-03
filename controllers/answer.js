const Models = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getAnswerById: async (req, res) => {
    const { answerId } = req.params;
    const answer = await Models.Answer.findOne({
      where: { id: answerId },
    });

    if (!answer)
      return res.status(400).json({ message: "No answer found with such id." });

    return res.json(answer);
  },

  postAnswer: async (req, res) => {
    const {
      patient_id,
      question_id,
      question,
      doctor_id,
      specialization_id,
      answer,
    } = req.body;

    const PostAnswer = await Models.Answer.create({
      patient_id,
      question_id,
      question,
      doctor_id,
      specialization_id,
      answer,
    });

    if (!PostAnswer)
      return res
        .status(400)
        .json({ error: true, message: "Not able to post the answer!" });

    const UpdateToBeAnswered = await Models.ToBeAnswered.findOne({
      where: {
        question_id: question_id,
        doctor_id: doctor_id
      },
    });

    if (UpdateToBeAnswered) {
      await UpdateToBeAnswered.update({isActive: 0})
      
      await Models.ToBeAnswered.destroy({
        where: {
          question_id: question_id,
          doctor_id: {[Op.ne]: doctor_id},
        }
      })
    }

    return res.json({
      error: false,
      message: "Answer Posted!",
    });
  },
};
