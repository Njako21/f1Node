function formatting(year, content, messagetype) {
    let type = "success";
    if (content == "") {
        content = "No content";
        type = "error";
    }

    const message = {
        Type: type,
        Content: {
            Year: year,
            Messagetype: messagetype,
            Content: content
        }
    };
    const jsonMessage = JSON.stringify(message);
    return jsonMessage;
}

module.exports = formatting;
