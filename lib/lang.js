module.exports = {
    getLang: (lang) => {
        var lang_desc;
        switch (lang) {
            case "en":
                lang_desc = ":flag_gb: English";
                break;
            case "ar":
                lang_desc = ":flag_ar: Español (Argentina)";
                break;
            case "zh_cn":
                lang_desc = ":flag_cn: 中文";
                break;
            case "de":
                lang_desc = ":flag_de: Deutsch";
                break;
            case "es":
                lang_desc = ":flag_es: Español (España)";
                break;
            case "fr":
                lang_desc = ":flag_fr: Français";
                break;
            case "il":
                lang_desc = ":flag_il: יִשׂרְאֵלִי";
                break;
            case "it":
                lang_desc = ":flag_it: Italiano";
                break;
            case "jp":
                lang_desc = ":flag_jp: 日本語";
                break;
            case "kr":
                lang_desc = ":flag_kr: 한국어";
                break;
            case "nl":
                lang_desc = ":flag_nl: Nederlands";
                break;
            case "pl":
                lang_desc = ":flag_pl: Polskie";
                break;
            case "pt":
                lang_desc = ":flag_pt: Português";
                break;
            case "ru":
                lang_desc = ":flag_ru: Pусский";
                break;
            case "tr":
                lang_desc = ":flag_tr: Türkçe";
                break;
            case "id":
                lang_desc = ":flag_id: Bahasa Indonesia";
                break;
            case "vi-VN":
                lang_desc = ":flag_vn: Tiếng Việt";
                break;
            default:
                lang_desc = "unknown";
        }
        return lang_desc;
    }
}