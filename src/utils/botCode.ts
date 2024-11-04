interface BotData {
    speakerUID: string
    srcLang: string
    targetLang: string
    srcLangName: string
    targetLangName: string
}

export const languageCodeList = [
    { name: 'Afrikaans', code: '01',},
    { name: 'Arabic', code: '02',},
    { name: 'Armenian', code: '03',},
    { name: 'Azerbaijani', code: '04',},
    { name: 'Belarusian', code: '05',},
    { name: 'Bosnian', code: '06',},
    { name: 'Bulgarian', code: '07',},
    { name: 'Catalan', code: '08',},
    { name: 'Chinese', code: '09',},
    { name: 'Croatian', code: '10',},
    { name: 'Czech', code: '11',},
    { name: 'Danish', code: '12',},
    { name: 'Dutch', code: '13',},
    { name: 'English', code: '14',},
    { name: 'Estonian', code: '15',},
    { name: 'Finnish', code: '16',},
    { name: 'French', code: '17',},
    { name: 'Galician', code: '18',},
    { name: 'German', code: '19',},
    { name: 'Greek', code: '20',},
    { name: 'Hebrew', code: '21',},
    { name: 'Hindi', code: '22',},
    { name: 'Hungarian', code: '23',},
    { name: 'Icelandic', code: '24',},
    { name: 'Indonesian', code: '25',},
    { name: 'Italian', code: '26',},
    { name: 'Japanese', code: '27',},
    { name: 'Kannada', code: '28',},
    { name: 'Kazakh', code: '29',},
    { name: 'Korean', code: '30',},
    { name: 'Latvian', code: '31',},
    { name: 'Lithuanian', code: '32',},
    { name: 'Macedonian', code: '33',},
    { name: 'Malay', code: '34',},
    { name: 'Marathi', code: '35',},
    { name: 'Maori', code: '36',},
    { name: 'Nepali', code: '37',},
    { name: 'Norwegian', code: '38',},
    { name: 'Persian', code: '39',},
    { name: 'Polish', code: '40',},
    { name: 'Portuguese', code: '41',},
    { name: 'Romanian', code: '42',},
    { name: 'Russian', code: '43',},
    { name: 'Serbian', code: '44',},
    { name: 'Slovak', code: '45',},
    { name: 'Slovenian', code: '46',},
    { name: 'Spanish', code: '47',},
    { name: 'Swahili', code: '48',},
    { name: 'Swedish', code: '49',},
    { name: 'Tagalog', code: '50',},
    { name: 'Tamil', code: '51',},
    { name: 'Thai', code: '52',},
    { name: 'Turkish', code: '53',},
    { name: 'Ukrainian', code: '54',},
    { name: 'Urdu', code: '55',},
    { name: 'Vietnamese', code: '56',},
    { name: 'Welsh', code: '57',}
  ];
  
export function getBotData(botCode: string): BotData {
    if (botCode.length !== 8) { throw new Error(`Invalid bot code ${botCode}`) }
    const speakerUID = botCode.slice(0, 4)
    const srcLang = botCode.slice(4, 6)
    const targetLang = botCode.slice(6, 8)
    const srcLangName = languageCodeList.find((lang) => lang.code === srcLang)?.name || ""
    const targetLangName = languageCodeList.find((lang) => lang.code === targetLang)?.name || ""
    return { speakerUID, srcLang, targetLang, srcLangName, targetLangName }
}