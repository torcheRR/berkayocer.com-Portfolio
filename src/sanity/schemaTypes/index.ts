import { localeString, localeText } from "./localized";
import { profile } from "./profile";
import { project } from "./project";
import { technology } from "./technology";
import { education, experience } from "./experience";

export const schemaTypes = [localeString, localeText, profile, project, technology, experience, education];

// Tek örneği olan belgeler: oluşturma menüsünde görünmez, silinemez/çoğaltılamaz.
export const singletonTypes = new Set(["profile"]);
