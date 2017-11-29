export default {
    CLIENTS: 10,
    USERS: 3,
    LETTER_TEMPLATES: 3,
};

const LETTER_BODY_TEMPLATES = [
    '<p><code>MyCompanyName</code></p>\n<p><code>MyCompanyAddrBloc</code></p>\n<p><br></p>\n<p><code>LetterDate</code></p>\n<p><br></p>\n<p><code>AddrBlock</code></p>\n<p>Dear <code>MrMsMrs</code> <code>FirstName</code> <code>LastName</code>,</p>\n<p>Thank you for your recent credit application. After reviewing your information, I am</p>\n<p>pleased to inform you that we have accepted you as a credit customer.</p>\n<p>The enclosed sheet describes the credit terms we offer. If you have any questions, please</p>\n<p>feel free to contact me.</p>\n<p>We appreciate your business and look forward to working with you on a long-term basis.</p>\n<p>Sincerely,</p>\n<p><br></p>\n<p><code>Signature</code></p>\n<p><code>Title</code></p>\n<p><code>MyCompanyName</code></p>',
    '<p><code>MyCompanyName</code></p>\n<p><code>MyCompanyAddrBlock</code></p>\n<p><br></p>\n<p><code>LetterDate</code></p>\n<p><br></p>\n<p><code>AddrBlock</code></p>\n<p>Dear <code>MrMsMrs</code> <code>FirstName</code> <code>LastName</code>,</p>\n<p><br></p>\n<p>Sincerely,</p>\n<p><br></p>\n<p><code>Signature</code></p>\n<p><code>Title</code></p>\n<p><code>MyCompanyName</code></p>',
    '<p><code>MyCompanyName</code></p>\n<p><code>MyCompanyAddrBlock</code></p>\n<p><code>LetterDate</code></p>\n<p><code>AddrBlock</code></p>\n<p>Dear <code>FirstName</code>,</p>\n<p>Happy Birthday!</p>\n<p>Please accept our wishes for an enjoyable day and a prosperous year.</p>\n<p>We also want to take this opportunity to thank you for your business. Customers like you make it all worthwhile.</p>\n<p>Congratulations again,</p>\n<p><code>Signature</code></p>\n<p><code>Title</code></p>\n<p><code>MyCompanyName</code></p>',
];

export {LETTER_BODY_TEMPLATES};