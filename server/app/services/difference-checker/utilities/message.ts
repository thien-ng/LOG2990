export interface Message {
    title:  string;
    body:   string;
}

export interface FormMessage {
    gameName:       string;
    checkedTypes:   [boolean, boolean, boolean];
    selectedOption: string;
    quantityChange: number;
}
