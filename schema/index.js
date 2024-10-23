const loremGeneratorSchema = {
  "name": "generateLoremIpsum",
  "description": "Generate Lorem Ipsum placeholder text",
  "input": {
    "type": "object",
    "properties": {
      "paragraphCount": {
        "type": "number",
        "description": "Number of paragraphs to generate",
        "minimum": 0,
        "maximum": 20,
        "example": 3,
        "default": 1

      },
      "wordsPerParagraph": {
        "type": "number",
        "description": "Number of words per paragraph",
        "minimum": 0,
        "maximum": 500,
        "example": 40,
        "default": 50
      }
    }
  },
  "output": {
    "type": "string",
    "description": "Generated lorem ipsum text",
    "example": "Lorem ipsum dolor sit amet, consectetur adipiscing elit quisquam ratione ea vel; impedit magna laborum proident fuga necessitatibus hic; numquam unde molestias nesciunt ducimus modi voluptate tempore nesciunt excepteur assumenda praesentium neque; provident aperiam quod incididunt placeat voluptate beatae occaecat.\n\nDeleniti eaque laboriosam officia dquis praesentium commodi suscipit tempore. Repudiandae beatae architecto veritatis ad doloremque itaque est provident temporibus praesentium. Mollitia amet distinctio deserunt et maxime occaecat perferendis magni facilis voluptates magna; suscipit cumque atque hic ert quidem dolorem autem."
  }
}

module.exports = {
  loremGeneratorSchema
};
