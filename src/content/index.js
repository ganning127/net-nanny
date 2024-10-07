/* eslint-disable no-undef */
import OpenAI from "openai";


// Insert your API keys here 
const OPEN_AI_API_KEY = "";
const OPEN_AI_PROJECT_ID = "";
const OPEN_AI_ORG_ID = "";


const openai = new OpenAI({
    apiKey: OPEN_AI_API_KEY,
    project: OPEN_AI_PROJECT_ID,
    organization: OPEN_AI_ORG_ID,
    dangerouslyAllowBrowser: true
});


async function main() {

    console.log('[content] loaded ');

    // get all innerText of aall elements in the document
    const allText = document.all[0].innerText;

    console.log(allText);

    // if allText is empty or is just \n, return, use trim
    if (!allText.trim()) {
        return;
    }




    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": "You are a concerned parent ensuring that your child does not encounter dangerous content online. Dangerous content includes, but is not limited to, pornography, violence, hate speech, explicit language, and other harmful materials. The user will represent a child providing you with website content for review before visiting it. Your task is to analyze the content and identify any dangerous elements. If no dangerous content is present, indicate that clearly. Output should be in JSON format only, without any additional explanations or formatting. All polarizing content should be considered dangerous."
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": `
                        This is the content of the website that the child wants to visit: 

                        -----------------------
                        ${allText}
                        -----------------------
                        Please review the text content of the website and send me back the dangerous elements in the format below. "reason" is a brief explanation of why the element is dangerous, and "dangerLevel" is a number from 1 to 5, where 1 is the least dangerous and 5 is the most dangerous. "querySelector" should be a set of keywords within the dangerous element that can be used to identify it.
                        
                        Do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation. 

                        [
                            {
                                "querySelector": "###",
                                "reason": "###",
                                "dangerLevel": "###"
                            },
                            {
                                "querySelector": "###",
                                "reason": "###",
                                "dangerLevel": "###"
                            },
                            ...
                        ]
                        `
                    }
                ]
            }
        ]
    });


    console.log(response.choices[0].message.content);

    const jsonResp = JSON.parse(response.choices[0].message.content);

    // for each dangerous element, blur it in the document. remember that the querySelector is a set of keywords within the dangerous element that can be used to identify it, so we need to loop through all the elements in the document and check if the querySelector is present in the innerText of the element

    function getDirectTextContent(element) {
        return Array.from(element.childNodes)
            .filter((node) => node.nodeType === Node.TEXT_NODE)
            .map((node) => node.textContent.trim())
            .join(" ");
    }

    const elements = document.querySelectorAll("*");
    elements.forEach((el) => {
        const directText = getDirectTextContent(el);
        jsonResp.forEach((element) => {
            if (directText.includes(element.querySelector)) {
                console.log("el", el);
                // Apply styles to blur or disable the element
                el.style.filter = "blur(5px)";
                el.style.pointerEvents = "none";
                el.style.userSelect = "none";
                el.style.webkitUserSelect = "none";
                el.style.mozUserSelect = "none";
            }
        });
    });
};

let timeoutId = null;

const observer = new MutationObserver((mutations) => {
    // Clear the previous timeout if it exists
    main();
});

observer.observe(document.documentElement, { childList: true, subtree: true });

export { };
