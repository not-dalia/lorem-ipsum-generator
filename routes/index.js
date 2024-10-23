var express = require('express');
var router = express.Router();
const Validator = require('jsonschema').Validator;
const { loremGeneratorSchema } = require('../schema/');
let { LoremGenerator } = require('../utils/loremGenerator');

const validator = new Validator();
const validateJsonSchema = (data) => {
  const inputSchema = loremGeneratorSchema.input;
  const validationResult = validator.validate(data, inputSchema);

  return {
    isValid: validationResult.valid,
    errors: validationResult.errors.map(error => error.stack)
  };
};

const generator = new LoremGenerator();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).json(loremGeneratorSchema);
});

router.post('/', function (req, res, next) {
  try {
    const { input } = req.body
    if (!input ) {
      res.status(200).json({ output: generator.generateText() });
    } else {
      let validationResult = validateJsonSchema(input);
      if (!validationResult.isValid) {
        res.status(500).json({ error: validationResult.errors });
      } else {
        res.status(200).json({ output: generator.generateText(input.paragraphCount, input.wordsPerParagraph) });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
