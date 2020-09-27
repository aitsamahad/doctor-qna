const Models = require("../models");

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

    const UpdateToBeAnswered = await Models.ToBeAnswered.findOne({
      where: {
        doctor_id: doctor_id,
        question_id: question_id,
      },
    });
    console.log(UpdateToBeAnswered);

    if (!PostAnswer)
      return res
        .status(400)
        .json({ error: true, message: "Not able to post the answer!" });

    return res.json({
      error: false,
      message: "Answer Posted!",
      hello: UpdateToBeAnswered,
    });
  },
};
