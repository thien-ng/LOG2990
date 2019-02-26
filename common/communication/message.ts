export interface Message {
    title:              string;
    body:               string;
}

export interface FormMessage {
    theme:              string;
    gameName:           string;
    checkedTypes:       [boolean, boolean, boolean];
    quantityChange:     number;
}
