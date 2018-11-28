exports.Archived = [
    {
        name: "Accounts Resolved",
        actions: [
            {
                name: "NORT",
                reasons: [
                    "NORT"
                ]
            },
            {
                name: "Zero",
                reasons: [
                    "Zero Balance"
                ]
            }
        ]
    }
]

exports.Hold = [
    {
        name: "Pending Payment",
        actions: [
            {
                name: "Pending Insurance Payment",
                reasons: [
                    "Received Check Information",
                    "Check Information not available"
                ]
            },
            {
                name: "Zero",
                reasons: [
                    "Zero Balance"
                ]
            }
        ]
    },
    {
        name: "Hospital Review",
        actions: [
            {
                name: "Post Payment / EoB",
                reasons: [
                    "Insurance EoB not posted"
                ]
            },
            {
                name: "Pending Credentialing",
                reasons: [
                    "Insurance pending Physician Credentialing",
                    "Insurance pending Facility Credentialing"
                ]
            },
            {
                name: "Misapplied Payment",
                reasons: [
                    "Payment posted to this account in error",
                    "Payment not posted to this account"
                ]
            },
            {
                name: "Coding Review",
                reasons: [
                    "Place of Service Denial",
                    "Other Coding Denial",
                    "Occurrence Code Denial",
                    "NDC missing / invalid",
                    "HCPCS Denial",
                    "Diagnosis Denial",
                    "CPT Denial",
                    "Condition Code Denial"
                ]
            },
            {
                name: "Audit Charges / Account",
                reasons: [
                    "Duplicate charges posted to account",
                    "Charges missing from account"
                ]
            }
        ]
    },
    {
        name: "Credits",
        actions: [
            {
                name: "Credit Balance",
                reasons: [
                    "Reverse Adjustment Posted",
                    "Refund to Patient",
                    "Refund to Insurance",
                    "Hospital Review",
                    "Correct Adjustment Posted"
                ]
            }
        ]
    },
    {
        name: "Continual Follow-Up",
        actions: [
            {
                name: "Too Soon",
                reasons: [
                    "Pending Client Response",
                    "Medicare Claim Billed within 45 days",
                    "Medicaid Claim Billed within 45 days",
                    "Commercial Claim Billed within 30 days"
                ]
            },
            {
                name: "Tickle",
                reasons: [
                    "Pending Patient Return Call (left message)",
                    "Pending Insurance Return Call (left message)"
                ]
            },
            {
                name: "Patient Letter",
                reasons: [
                    "3rd Request",
                    "2nd Request",
                    "1st Request"
                ]
            },
            {
                name: "Faxed Insurance Status Request",
                reasons: [
                    "Pending Insurance Status Fax Back"
                ]
            },
            {
                name: "Claim in Process",
                reasons: [
                    "Claim in process with Payer",
                    "Claim in Litigation"
                ]
            }
        ]
    },
    {
        name: "Billed",
        actions: [
            {
                name: "Claim Faxed",
                reasons: [
                    "No record of claim",
                    "Corrected Claim",
                    "Appeal"
                ]
            },
            {
                name: "Claim Billed",
                reasons: [
                    "No record of claim – Paper",
                    "Corrected Claim – Paper",
                    "No record of claim – Electronic",
                    "Corrected Claim – Electronic"
                ]
            },
            {
                name: "Claim Appealed",
                reasons: [
                    "Underpayment",
                    "Non-Covered Charges",
                    "Medical Necessity",
                    "Maximum Benefits",
                    "Client billed Claim"
                ]
            }
        ]
    },
    {
        name: "Adjustment",
        actions: [
            {
                name: "Post Adjustment by Client",
                reasons: [
                    "Small Balance write off",
                    "Past the Filing Deadline",
                    "Contractual Agreement",
                    "Authorization Denial"
                ]
            }
        ]
    },
    {
        name: "Returned to Facility",
        actions: [
            {
                name: "Medical Records Unavailable",
                reasons: [
                    "Medical Records cannot be located"
                ]
            },
            {
                name: "Medical Records Unavailable",
                reasons: [
                    "Medical Records cannot be located"
                ]
            },
            {
                name: "Does Not Meet PMS Criteria",
                reasons: [
                    "PMS does not work this payer",
                    "Exceeds PMS dollar limit"
                ]
            },
            {
                name: "Aged Account",
                reasons: [
                    "Date of Service is unbillable"
                ]
            }
        ]
    },
    {
        name: "Patient Responsibility",
        actions: [
            {
                name: "Patient Balance",
                reasons: [
                    "Patient Unresponsive - Balance needs to be moved to Correct Bucket",
                    "Patient Unresponsive - Balance in Correct Bucket",
                    "Patient Not Insured - Balance needs to be moved to Correct Bucket",
                    "Patient Not Insured - Balance in Correct Bucket",
                    "Deductible Balance needs to be moved to Correct Bucket",
                    "Deductible Balance in Correct Bucket",
                    "Copay Balance needs to be moved to Correct Bucket",
                    "Copay Balance in Correct Bucket",
                    "Coinsurance Balance needs to be moved to Correct Bucket",
                    "Coinsurance Balance in Correct Bucket",
                    "Balance needs to be moved to Correct Bucket",
                    "Balance in Correct Bucket"
                ]
            },
            {
                name: "Insurance pending information from Patient",
                reasons: [
                    "Balance needs to be moved to Correct Bucket",
                    "Balance in Correct Bucket"
                ]
            }
        ]
    }
]

exports.Active = [
    {
        name: "Rebill",
        actions: [
            {
                name: "Forward to Biller",
                reasons: [
                    "Request Electronic Billing"
                ]
            }
        ]
    },
    {
        name: "Continual Follow-Up",
        actions: [
            {
                name: "Insurance Payment Received",
                reasons: [
                    "Review Balance"
                ]
            }
        ]
    },
    {
        name: "Additional",
        actions: [
            {
                name: "Bill Supplement Payer",
                reasons: [
                    "Medicare paid primary"
                ]
            },
            {
                name: "Request UB",
                reasons: [
                    "Paper (red/white)",
                    "Paper (black/white)"
                ]
            },
            {
                name: "Request Proof of Timely Filing",
                reasons: [
                    "TMM Proof of Timely Filing",
                    "Electronic Billing Proof of Timely Filing",
                    "Certified Mail Proof of Timely Filing"
                ]
            },
            {
                name: "Request Other Attachment",
                reasons: [
                    "Pending Rebill / Appeal"
                ]
            },
            {
                name: "Request EoB",
                reasons: [
                    "Request Medicare RA",
                    "Insurance EoB"
                ]
            },
            {
                name: "Request Medical Records",
                reasons: [
                    "Partial Medical Records",
                    "Complete Medical Records"
                ]
            },
            {
                name: "Request Itemized Statement",
                reasons: [
                    "Pending Rebill / Appeal"
                ]
            },
            {
                name: "Request Correspondence",
                reasons: [
                    "From Patient",
                    "From Client"
                ]
            },
            {
                name: "Request 1500",
                reasons: [
                    "Paper (red/white)",
                    "Paper (black/white)"
                ]
            },
        ]
    },
    {
        name: "Adjustment",
        actions: [
            {
                name: "Post Adjustment by PMS",
                reasons: [
                    "Small Balance write off",
                    "Past the Filing Deadline",
                    "Contractual Agreement",
                    "Authorization Denial",
                    "Client approved 835 adjustment"
                ]
            }
        ]
    },
]