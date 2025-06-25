const messageInput = document.getElementById("messageInput");
const previewElement = document.getElementById("preview");

function replaceUsingTags(inputString, oldVal, newVal){
    let string = inputString;
    let closing = false;
    while (string.indexOf(oldVal) > -1){
        // accounts for whether the character is escaped or not
        const slashIndex = string.indexOf(oldVal) - 1;
        if (string.indexOf(oldVal) > 0 && string[slashIndex] == "\\"){
            string = string.slice(0, slashIndex) + string.slice(slashIndex + 1);
            string = string.replace(oldVal, "&escapedFiller;");
        }
        else{
            const newVal2 = "<" + "/".repeat(closing) + newVal.slice(1);
            string = string.replace(oldVal, newVal2);
            closing = !closing;
        }
    }
    if (closing) {
        string += "</" + newVal.slice(1);
    }
    string = string.replaceAll("&escapedFiller;", oldVal);
    return string
}

function updatePreview(){
    let preview = messageInput.value;

    const unsafeCharacters = ["&", "<", ">", "="];
    const escapedCharacters = ["&amp;", "&lt;", "&gt;", "&equals;"]

    for (const i in unsafeCharacters){
        preview = preview.replaceAll(unsafeCharacters[i], escapedCharacters[i]);
    }

    // Accounts for newlines
    preview = preview.replaceAll("\n", "<br>");

    // Replaces any bolds
    preview = replaceUsingTags(preview, "**", "<b>");
    
    // Replaces any italics
    preview = preview.replaceAll("<br>* ", "<br>&escapedListItem;");
    preview = replaceUsingTags(preview, "*", "<i>");
    preview = replaceUsingTags(preview, "__", "<u>");
    preview = replaceUsingTags(preview, "_", "<i>");
    preview = replaceUsingTags(preview, "~~", "<s>");
    
    // Replaces any mini code elements
    preview = replaceUsingTags(preview, "`", "<code>");

    // Replaces any headings
    preview = preview.split("<br>");
    for (const i in preview){
        if (preview[i][0] == "#"){
            if (preview[i].indexOf(" ") <= 3){
                const header = preview[i].indexOf(" ");
                preview[i] = "<h" + header + ">" +
                             preview[i].slice(header)
                             + "</h" + header + ">";
            }
        }
    }
    for (const i in preview){
        if (preview[i][0] == "-"){
            if (preview[i][1] + preview[i][2] == "# "){
                preview[i] = "<small>" + preview[i].slice(2) + "</small>";
            }
        }
    }
    for (const i in preview){
        if (preview[i].indexOf("&escapedListItem;") == 0){
            preview[i] = "<li>" + preview[i].slice(17,) + "</li>";
        }
    }
    for (const i in preview){
        if (preview[i].indexOf("- ") == 0){
            preview[i] = "<li>" + preview[i].slice(2,) + "</li>";
        }
    }
    preview = preview.join("<br>");
    // Since headers and smalls already have line breaks, extra line breaks are removed
    preview = preview.replaceAll("<h1><br>", "<h1>");
    preview = preview.replaceAll("<h2><br>", "<h2>");
    preview = preview.replaceAll("<h3><br>", "<h3>");
    preview = preview.replaceAll("</h1><br>", "</h1>");
    preview = preview.replaceAll("</h2><br>", "</h2>");
    preview = preview.replaceAll("</h3><br>", "</h3>");
    preview = preview.replaceAll("<small><br>", "<small>");
    preview = preview.replaceAll("</small><br>", "</small>");
    preview = preview.replaceAll("<li><br>", "<li>");
    preview = preview.replaceAll("</li><br>", "</li>");

    previewElement.innerHTML = preview;
}

document.addEventListener("keydown", updatePreview);
document.addEventListener("keyup", updatePreview);
updatePreview();