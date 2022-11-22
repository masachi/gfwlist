const dayjs = require("dayjs");
const fs = require("fs");
const Base64 = require('js-base64').Base64;

const loadCurrentGfwList = () => {
    let currentGfwList = fs.readFileSync('./gfwlist.txt');

    return Base64.decode(currentGfwList.toString());
}

const loadCustomProxyRules = () => {
    let customRules = fs.readFileSync('./custom.txt');

    return customRules.toString();
}

const appendCustomProxyRules = (currentGfwList, customRules) => {
    return currentGfwList.replace(/! https:\/\/github\.com\/gfwlist\/gfwlist\/issues\/\./g, customRules);
}

const replaceChecksumAndTimestamp = (customedRules) => {
    let result = customedRules;
    result = result.replace(/! Checksum: .+/g, '');
    // Mon, 14 Nov 2022 00:20:44 -0500
    result = result.replace(/! Last Modified: .+/g, `! Last Modified: ${dayjs().format('ddd, DD MMM YYYY HH:mm:ss ZZ')}`)

    return result;
}

const exportCustonRules = (rules) => {
    fs.writeFileSync('gfwlist-custom.txt', Base64.encode(rules), {
        encoding: 'utf-8',
        flag: 'w'
    });
}

const existGfwListRules = loadCurrentGfwList();
const customRules = loadCustomProxyRules();
const customedRules = appendCustomProxyRules(existGfwListRules, customRules);
exportCustonRules(replaceChecksumAndTimestamp(customedRules));