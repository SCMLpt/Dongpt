class TextProcessor {
  async execute(context) {
    if (context.text) {
      context.text = context.text.toUpperCase();
    }
  }
}

module.exports = TextProcessor;
