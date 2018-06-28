import Flags from "../collection";

export default class FlagService {
    static createFlag(data) {
        Flags.insert(data);
        
    }
}