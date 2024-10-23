const DEFAULT_CONFIG = {
  wordBank: ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde", "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque", "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta", "explicabo", "nemo", "ipsam", "quia", "voluptas", "aspernatur", "aut", "odit", "fugit", "consequuntur", "magni", "dolores", "eos", "ratione", "sequi", "nesciunt", "neque", "porro", "quisquam", "dolorem", "numquam", "eius", "modi", "tempora", "magnam", "aliquam", "quaerat", "minima", "nostrumd", "exercitationem", "ullam", "corporis", "suscipit", "laboriosam", "aliquid", "commodi", "consequatur", "dquis", "autem", "vel", "eum", "quam", "nihil", "molestiae", "illum", "quo", "at", "vero", "accusamus", "iusto", "odio", "dignissimos", "ducimus", "blanditiis", "praesentium", "voluptatum", "deleniti", "atque", "corrupti", "quos", "quas", "molestias", "excepturi", "obcaecati", "cupiditate", "provident", "similique", "mollitia", "animi", "dolorum", "fuga", "harum", "quidem", "rerudum", "facilis", "ert", "expedita", "distinctio", "nam", "libero", "tempore", "cum", "soluta", "nobis", "eligendi", "optio", "cumque", "impedit", "minus", "quod", "maxime", "placeat", "facere", "possimus", "assumenda", "repellendaus", "temporibus", "quibusdam", "officiis", "debitis", "rerum", "necessitatibus", "saepe", "eveniet", "voluptates", "repudiandae", "recusandae", "itaque", "earum", "hic", "tenetur", "a", "sapiente", "delectus", "reiciendis", "voluptatibus", "maiores", "alias", "perferendis", "doloribus", "asperiores", "repellat"],
  startingText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  punctuation: [".", ",", ";"],
  minSentenceLength: 7,
  maxSentenceLength: 13,
  maxWordsPerParagraph: 500
};

class LoremGenerator {
  constructor(config = DEFAULT_CONFIG) {
    this.config = config;
    this.state = {
      previousWordIndex: -1,
      previousPunctuation: '.',
      sentenceWordCount: 0,
      paragraphWordCount: 0
    };
  }

  generateText(paragraphCount = 1, wordsPerParagraph = 50) {
    if (paragraphCount === 0 || wordsPerParagraph === 0) {
      return "";
    }

    this.resetState();

    let text = this.initializeText(wordsPerParagraph);

    for (let i = 0; i < paragraphCount; i++) {
      text += this.generateParagraph(wordsPerParagraph).trim() + "\n\n";
      this.resetParagraphState();
    }

    return text.trim();
  }

  initializeText(wordsPerParagraph) {
    const initialWords = this.config.startingText.split(" ");

    // Making sure that the starting text is not longer than the desired paragraph length
    const trimmedWords = initialWords.slice(0, wordsPerParagraph);
    this.state.sentenceWordCount = trimmedWords.length;
    this.state.paragraphWordCount = trimmedWords.length;
    this.state.previousWordIndex = this.config.wordBank.indexOf(
      trimmedWords[trimmedWords.length - 1].toLowerCase()
    );
    return trimmedWords.join(" ");
  }

  generateParagraph(wordsPerParagraph) {
    let paragraphText = "";
    let remainingWords = wordsPerParagraph - this.state.paragraphWordCount;
    let desiredSentenceLength = this.getDesiredSentenceLength(remainingWords);

    while (
      this.state.paragraphWordCount < wordsPerParagraph &&
      this.state.paragraphWordCount < this.config.maxWordsPerParagraph
    ) {
      paragraphText += this.generateWord();
      remainingWords = wordsPerParagraph - this.state.paragraphWordCount;

      if (this.shouldAddPunctuation(desiredSentenceLength, remainingWords)) {
        paragraphText += this.addPunctuation(remainingWords);
        desiredSentenceLength = this.getDesiredSentenceLength(remainingWords);
      }
    }

    return paragraphText;
  }

  generateWord() {
    let wordIndex = this.getUniqueWordIndex();
    let word = this.config.wordBank[wordIndex];

    if (this.shouldCapitalizeWord()) {
      word = this.capitalize(word);
    }

    this.state.previousWordIndex = wordIndex;
    this.state.sentenceWordCount++;
    this.state.paragraphWordCount++;

    return " " + word;
  }

  getUniqueWordIndex() {
    let wordIndex;
    do {
      wordIndex = Math.floor(Math.random() * this.config.wordBank.length);
    } while (wordIndex === this.state.previousWordIndex);
    return wordIndex;
  }

  shouldCapitalizeWord() {
    return this.state.sentenceWordCount === 0 && this.state.previousPunctuation === '.';
  }

  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }


  shouldAddPunctuation(desiredSentenceLength, remainingWords) {
    return this.state.sentenceWordCount >= desiredSentenceLength || remainingWords === 0;
  }

  addPunctuation(remainingWords) {
    let punctuation = this.config.punctuation[
      Math.floor(Math.random() * this.config.punctuation.length)
    ];
    if (remainingWords <= 1) {
      punctuation = ".";
    }
    this.state.previousPunctuation = punctuation;
    this.state.sentenceWordCount = 0;
    return punctuation;
  }

  getDesiredSentenceLength(remainingWords) {
    if (remainingWords < 4) {
      return remainingWords;
    }
    return Math.min(
      remainingWords,
      Math.floor(Math.random() *
        (this.config.maxSentenceLength - this.config.minSentenceLength)) +
        this.config.minSentenceLength
    );
  }

  resetParagraphState() {
    this.state.paragraphWordCount = 0;
    this.state.sentenceWordCount = 0;
  }

  resetState() {
    this.state = {
      previousWordIndex: -1,
      previousPunctuation: '.',
      sentenceWordCount: 0,
      paragraphWordCount: 0
    };
  }
}

module.exports = {
  LoremGenerator
};
