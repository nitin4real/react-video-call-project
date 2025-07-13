import { languageList } from "../constants/languageCodes"

interface BotData {
    speakerUID: string
    srcLang: string
    targetLang: string
    srcLangName: string
    targetLangName: string
}

export function getBotData(botCode: string): BotData {
    if (botCode.length !== 8) { throw new Error(`Invalid bot code ${botCode}`) }
    const speakerUID = botCode.slice(0, 4)
    const srcLang = botCode.slice(4, 6)
    const targetLang = botCode.slice(6, 8)
    const srcLangName = languageList.find((lang) => lang.code === srcLang)?.name || ""
    const targetLangName = languageList.find((lang) => lang.code === targetLang)?.name || ""
    return { speakerUID, srcLang, targetLang, srcLangName, targetLangName }
}