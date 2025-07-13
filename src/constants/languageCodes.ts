
interface languageCodeObj {
    name: LanguageName;
    code: string;
    isoCode: string;
}

export enum LanguageName {
    Arabic = 'Arabic',
    Bengali = 'Bengali',
    Chinese = 'Chinese',
    Dutch = 'Dutch',
    English = 'English',
    EnglishIN = 'English-India',
    French = 'French',
    German = 'German',
    Hebrew = 'Hebrew',
    Hindi = 'Hindi',
    Indonesian = 'Indonesian',
    Italian = 'Italian',
    Japanese = 'Japanese',
    Kannada = 'Kannada',
    Korean = 'Korean',
    Malay = 'Malay',
    Persian = 'Persian',
    Portuguese = 'Portuguese',
    Russian = 'Russian',
    Spanish = 'Spanish',
    Tagalog = 'Tagalog',
    Tamil = 'Tamil',
    Thai = 'Thai',
    Turkish = 'Turkish',
    Vietnamese = 'Vietnamese',
    Welsh = 'Welsh'
}

export const languageList: languageCodeObj[] = [
    { name: LanguageName.Arabic, code: '02', isoCode: 'ar-EG' },
    { name: LanguageName.Bengali, code: '58', isoCode: 'bn-IN' },
    { name: LanguageName.Chinese, code: '09', isoCode: 'zh-CN' },
    { name: LanguageName.Dutch, code: '13', isoCode: 'nl-NL' },
    { name: LanguageName.English, code: '14', isoCode: 'en-US' },
    { name: LanguageName.EnglishIN, code: '15', isoCode: 'en-IN' },
    { name: LanguageName.French, code: '17', isoCode: 'fr-FR' },
    { name: LanguageName.German, code: '19', isoCode: 'de-DE' },
    { name: LanguageName.Hebrew, code: '21', isoCode: 'he-IL' },
    { name: LanguageName.Hindi, code: '22', isoCode: 'hi-IN' },
    { name: LanguageName.Indonesian, code: '25', isoCode: 'id-ID' },
    { name: LanguageName.Italian, code: '26', isoCode: 'it-IT' },
    { name: LanguageName.Japanese, code: '27', isoCode: 'ja-JP' },
    { name: LanguageName.Kannada, code: '28', isoCode: 'kn-IN' },
    { name: LanguageName.Korean, code: '30', isoCode: 'ko-KR' },
    { name: LanguageName.Malay, code: '34', isoCode: 'ms-MY' },
    { name: LanguageName.Persian, code: '39', isoCode: 'fa-IR' },
    { name: LanguageName.Portuguese, code: '41', isoCode: 'pt-PT' },
    { name: LanguageName.Russian, code: '43', isoCode: 'ru-RU' },
    { name: LanguageName.Spanish, code: '47', isoCode: 'es-ES' },
    { name: LanguageName.Tagalog, code: '50', isoCode: 'fil-PH' },
    { name: LanguageName.Tamil, code: '51', isoCode: 'ta-IN' },
    { name: LanguageName.Thai, code: '52', isoCode: 'th-TH' },
    { name: LanguageName.Turkish, code: '53', isoCode: 'tr-TR' },
    { name: LanguageName.Vietnamese, code: '56', isoCode: 'vi-VN' },
]

export const getLanguageISOCodeByName = (languageName: string): string | undefined => {
    return languageList.find(language => language.name === languageName)?.isoCode
}

export const getLanguageNameByISOCode = (isoCode: string): string => {
    return languageList.find(language => language.isoCode === isoCode)?.name ?? 'Unknown Lang.'
}

export const voiceList = [
    { voiceName: 'Male', code: 'EkK5I93UQWFDigLMpZcX', gender: 'male' },
    { voiceName: 'Female', code: 'kL06KYMvPY56NluIQ72m', gender: 'female' },
]
