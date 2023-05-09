/**
 * Creates a JSON message with a specific format.
 * @param {string} year - The year of the message.
 * @param {string} content - The content of the message.
 * @param {string} messagetype - The type of message.
 * @returns {string} The formatted JSON message.
 */
function formatting(year, content, messagetype) {
    let type = "success";
    if (content == "") { // if content is empty, set the type to error and content to "No content"
        content = "No content";
        type = "error";
    }

    // create a message object with the provided year, message type, and content
    const message = {
        Type: type,
        Content: {
            Year: year,
            Messagetype: messagetype,
            Content: content
        }
    };

    // convert the message object to a JSON string
    const jsonMessage = JSON.stringify(message);

    return jsonMessage;
}

module.exports = formatting;
