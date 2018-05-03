export default class TaskViewService {

    static getPdfName(pdf) {
        return pdf.name.slice(0, pdf.name.indexOf('.'))
    }
}