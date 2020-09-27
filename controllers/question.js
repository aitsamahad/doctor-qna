const Models = require("../models");
const formidable = require("formidable");
const { postQuestion } = require("../model-functions/question");

module.exports = {
  getQuestionById: async (req, res, next, id) => {
    const question = await Models.Question.findOne({
      where: { id: id },
      include: [
        {
          model: Models.PATIENT_UPLOAD,
        },
        {
          model: Models.Answer,
          include: [
            {
              model: Models.Doctor,
              attributes: ["f_name", "l_name"],
            },
          ],
        },
      ],
      order: [[{ model: Models.Answer }, "id", "DESC"]],
      // include: ["refDocs"],
    });

    if (!question)
      return res.status(400).json({
        error: "No Question found",
      });
    req.question = question;
    next();
  },

  getQuestion: async (req, res) => {
    return res.json(req.question);
  },

  addQuestion: async (req, res) => {
    let form = new formidable.IncomingForm({ multiples: true });
    form.keepExtensions = true;

    await form.parse(req, (err, fields, { uploads }) => {
      (async function () {
        const question = await postQuestion(req, err, fields, uploads);
        if (question.error)
          return res.status(400).json({
            error: true,
            message: question.message,
            newQuestion: false,
          });

        res.status(201).json({
          error: false,
          id: question.newQuestion.id,
          question: question.newQuestion.question,
          message: "Posted Successfully!",
        });
      })();
    });
  },

  clearQuestions: async (req, res) => {
    await Models.Question.destroy({
      where: {},
      truncate: true,
    });
    res.json({ message: "Question's table has been cleared!" });
  },
};
