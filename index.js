"use strict";

const messageInput = document.getElementById("messageInput");
const previewElement = document.getElementById("preview");

function multiStartsWith(string, array){
    for (const item of array){
        if (string.startsWith(item)){
            return true
        }
    }
    return false
}

function headerProperties(preview2){
    let preview = preview2;
    for (const i in preview){
        let line = preview[i];
        if (line.text.startsWith("# ")){
            line.headerLevel = 1;
            line.text = line.text.slice(2,);
        }
        else if (line.text.startsWith("## ")){
            line.headerLevel = 2;
            line.text = line.text.slice(3,);
        }
        else if (line.text.startsWith("### ")){
            line.headerLevel = 3;
            line.text = line.text.slice(4,);
        }
        else if (line.text.startsWith("-# ")){
            line.headerLevel = -1;
            line.text = line.text.slice(3,);
        }
        preview[i] = line;
    }
    return preview;
}

function listItemProperties(preview2){
    let preview = preview2;
    for (const i in preview){
        const text = preview[i].text;
        if (text.startsWith("- ") ||
            text.startsWith("* ")){
                preview[i] = {
                    ...preview[i],
                    "text": text.slice(2,),
                    "isListItem": true
                }
        }
    }
    return preview;
}

function concatList(preview2){
    const preview = preview2;
    let stringPreview = "";
    for (const line of preview){
        let text = line.text;
        if (line.headerLevel > 0){
            text = "<h" + line.headerLevel + ">" 
            + text
            + "</h" + line.headerLevel + ">";
        }
        else if (line.headerLevel === -1){
            text = "<small>" + text + "</small>";
        }
        if (line.isListItem){
            text = "<li>" + text + "</li>";
        }
        if (multiStartsWith(text, ["<h", "<li>", "<small>"])){
            stringPreview += text;
        }
        else {
            // We don't have to worry about there being an extra <br> at the end because that won't be shown
            stringPreview += text + "<br>";
        }
    }
    return stringPreview;
}

function replaceMarkdown(preview2, markup2, tag2){
    let preview = preview2;
    const markup = markup2;
    const tag = tag2;
    const ctag = "</" + tag.slice(1,);
    for (const line of preview){
        let closing = false;
        while (line.text.indexOf(markup) > -1){
            if (closing){
                line.text = line.text.replace(markup, ctag);
            }
            else{
                line.text = line.text.replace(markup, tag);
            }
            closing = !closing;
        }
    }
    return preview;
}

function updatePreview(){
    let preview = messageInput.value ? messageInput.value
                                     : "Sample Text";

    const unsafeCharacters = ["&", "<", ">", "="];
    const escapedCharacters = ["&amp;", "&lt;", "&gt;", "&equals;"]

    for (const i in unsafeCharacters){
        preview = preview.replaceAll(unsafeCharacters[i], escapedCharacters[i]);
    }

    // Splits each line into seperate list elements, as 99% of markdown only works on a single line
    preview = preview.split("\n");

    // Adds properties to each line
    for (const i in preview){
        preview[i] = {
            "text": preview[i],
            "headerLevel": 0,
            "isListItem": false,
            "isPartOfCodeBlock": false
        }
    }
    
    // Adds line properties
    preview = headerProperties(preview);
    preview = listItemProperties(preview);

    // Adds markdown
    preview = replaceMarkdown(preview, "`", "<code>");
    preview = replaceMarkdown(preview, "**", "<b>");
    preview = replaceMarkdown(preview, "*", "<i>");
    preview = replaceMarkdown(preview, "_", "<i>");
    preview = replaceMarkdown(preview, "~~", "<s>");

    // concat the list back into a string
    preview = concatList(preview);

    previewElement.innerHTML = preview;
}

if (document.referrer){
    const origin = document.referrer;
    console.log(origin);
    const ggsans = document.createElement("style");
    ggsans.innerHTML = `@font-face {
        font-family: 'ggsans normal';
        src: url(${origin}ggsans/ggsans-Normal.ttf);
        font-weight: normal;
        font-style: normal;
    }
    @font-face {
        font-family: 'ggsans semibold';
        src: url(${origin}ggsans/ggsans-Semibold.ttf);
        font-weight: normal;
        font-style: normal;
    }
    @font-face {
        font-family: 'ggsans bold';
        src: url(${origin}ggsans/ggsans-Bold.ttf);
        font-weight: normal;
        font-style: normal;
    }`
}

document.addEventListener("keydown", updatePreview);
document.addEventListener("keyup", updatePreview);
updatePreview();