
import Letters from "/imports/api/letters/collection";

export default class LetterManagement{
    static run(){
        const letters = Letters.find().fetch();
        //convert every letter to pdf
        for(letter of letters){
        }
    }
}