let expect = require("expect");

var { generateMessage } = require("./message");

describe("Generate Message", () => {
  it("Should be generate correct new message object", () => {
    let from = "WDJ",
      text = "some random text",
      message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe("number");
    expect(message).toMatchObject({ from, text });
  });
});
