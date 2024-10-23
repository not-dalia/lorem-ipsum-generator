const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../api');

chai.use(chaiHttp);

describe('Lorem Ipsum Generator', () => {
  describe('Text Generation', () => {
    const { LoremGenerator } = require('../utils/loremGenerator');
    const loremGenerator = new LoremGenerator();

    it('should generate the correct number of paragraphs', () => {
      const paragraphCount = 5;
      const wordsPerParagraph = 60;
      const result = loremGenerator.generateText(paragraphCount, wordsPerParagraph);

      expect(result).to.be.a('string');
      const paragraphs = result.split('\n\n');
      expect(paragraphs).to.have.lengthOf(paragraphCount);
    });

    it('should generate paragraphs with the correct number of words', () => {
      const paragraphCount = 2;
      const wordsPerParagraph = 40;
      const result = loremGenerator.generateText(paragraphCount, wordsPerParagraph);

      expect(result).to.be.a('string');
      const paragraphs = result.split('\n\n');
      paragraphs.forEach(paragraph => {
        const words = paragraph.trim().split(' ');
        expect(words).to.have.lengthOf(wordsPerParagraph);
      });
    });

    it('should return properly formatted text', () => {
      const paragraphCount = 3;
      const wordsPerParagraph = 50;
      const result = loremGenerator.generateText(paragraphCount, wordsPerParagraph);

      expect(result).to.be.a('string');
      const paragraphs = result.split('\n\n');
      paragraphs.forEach(paragraph => {
        const words = paragraph.trim().split(' ');
        words.forEach(word => {
          expect(word).to.match(/^[A-Za-z,.;]+$/);
        });
      });
    });

    it('should start with "Lorem ipsum dolor sit amet"', () => {
      const paragraphCount = 1;
      const wordsPerParagraph = 50;
      const result = loremGenerator.generateText(paragraphCount, wordsPerParagraph);

      expect(result).to.be.a('string');
      const paragraphs = result.split('\n\n');
      expect(paragraphs[0].trim().startsWith('Lorem ipsum dolor sit amet')).to.be.true;
    });

    it('should handle 0 paragraphs', () => {
      const paragraphCount = 0;
      const wordsPerParagraph = 50;
      const result = loremGenerator.generateText(paragraphCount, wordsPerParagraph);

      expect(result).to.be.a('string');
      expect(result).to.be.empty;
    });

    it('should handle 0 words', () => {
      const paragraphCount = 3;
      const wordsPerParagraph = 0;
      const result = loremGenerator.generateText(paragraphCount, wordsPerParagraph);

      expect(result).to.be.a('string');
      expect(result).to.be.empty;
    });
  });

  describe('API Endpoints', () => {
    it('should return lorem ipsum text in an output field via POST', (done) => {
      chai.request(app)
        .post('/lorem/')
        .send({ input: { paragraphCount: 2, wordsPerParagraph: 50 } })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('output');
          expect(res.body.output).to.be.a('string');
          done();
        });
    });

    it('should handle invalid parameters', (done) => {
      chai.request(app)
        .post('/lorem/')
        .send({ input: { paragraphCount: 'a', wordsPerParagraph: 50 } })
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('error');
          done();
        });
    });

    it('should use default parameters if none are provided', (done) => {
      chai.request(app)
        .post('/lorem/')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('output');
          expect(res.body.output).to.be.a('string');
          done();
        });
    });

    it('should return json schema docs via GET', (done) => {
      const { loremGeneratorSchema } = require('../schema/');
      chai.request(app)
        .get('/lorem/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal(loremGeneratorSchema);
          done();
        });
    });
  });
});
