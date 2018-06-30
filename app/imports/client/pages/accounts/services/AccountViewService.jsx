export default class AccountViewService {
  static getPdfName(pdf) {
    return pdf.name.slice(0, pdf.name.indexOf("."));
  }
}
