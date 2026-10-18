export type HelpArticle = {
  slug: string;
  title: string;
  summary: string;
  sections: [string, string[]][];
  links: [string, string][];
};
export const helpArticles: HelpArticle[] = [
  {
    slug: "place-order",
    title: "How to order",
    summary:
      "Choose the right route for your product, then review your order before payment.",
    sections: [
      [
        "Choose what you need",
        [
          "Apparel is for the finished designs shown in our product images. Choose your size, colour and quantity. You do not need to upload artwork.",
          "Custom is for printing your own design on clothing. Choose a product and its specifications, then select whether you have finished artwork or need design help.",
          "Jerseys have their own order form. Choose your team, season, home, away or third kit, and size. Printed names and numbers are optional. Their charges are shown separately.",
          "For business cards, flyers and other printed materials, browse Printing and choose the available specifications.",
        ],
      ],
      [
        "Check the details that will be produced",
        [
          "For jerseys, capitalisation matters: SHINE, Shine and shine are different print instructions. Numbers such as 07 keep their leading zero. Check the final summary carefully.",
          "Multiple jerseys in one submission share the same size, name and number. Place separate orders for different personalisations.",
          "Apparel and Custom items use the cart and checkout. Jerseys use the dedicated jersey form. Sign in before submitting your order.",
        ],
      ],
      [
        "Review comes before payment",
        [
          "Keep the order reference shown after submission. We confirm availability, the applicable specifications and delivery charges before final pricing.",
          "Custom and print items need approved artwork. Jerseys need specification approval. Ready-designed Apparel does not need customer artwork approval.",
          "Once the total is confirmed, open your order and follow its payment link. Submitting an order or uploading a receipt does not itself confirm payment.",
        ],
      ],
    ],
    links: [
      ["Shop Apparel", "/shop/apparel"],
      ["Custom printing", "/shop/custom"],
      ["Shop Jerseys", "/shop/jerseys"],
      ["Browse Printing", "/shop/print"],
    ],
  },
  {
    slug: "track-order",
    title: "Track your order",
    summary:
      "Your signed-in order page is the place to check progress, payment and the next action.",
    sections: [
      [
        "Find the order",
        [
          "Sign in with the account used to place it, open My orders and select the order reference.",
          "You can see the saved product details and current status there. Customer notifications also link to relevant order updates.",
          "If you cannot find an order, check that you are using the same account. Contact us with the reference before submitting a replacement order.",
        ],
      ],
      [
        "Understand the status",
        [
          "Awaiting artwork: a Custom or print item needs a file or an artwork update. Follow the artwork link on that order.",
          "Under review: the order details are being checked. Awaiting payment: final pricing is confirmed and payment is the next step.",
          "Confirmed: payment has been verified. In production: work has started. Ready: production is complete and pickup or delivery arrangements are next.",
          "Dispatched: the order has been sent for delivery. Completed: the handover has been recorded. A cancelled order will show Cancelled.",
        ],
      ],
      [
        "Ask about an update",
        [
          "Send your order reference and the specific question by email or WhatsApp. If the question concerns delivery, include the recipient name and destination.",
          "We do not display a live courier map. If carrier or tracking details have been recorded, check them on your order page.",
        ],
      ],
    ],
    links: [["Open My orders", "/shop/order"]],
  },
  {
    slug: "artwork",
    title: "Artwork & personalisation",
    summary:
      "Artwork is part of Custom printing. Apparel and jersey personalisation follow different checks.",
    sections: [
      [
        "Know whether you need a file",
        [
          "Ready-designed Apparel is sold with the design shown. No customer artwork upload is required.",
          "Jersey orders use the saved team, kit, size, printed name and printed number. You do not need to submit artwork for these standard options.",
          "Custom clothing and print jobs need finished artwork or design assistance. Design assistance can only be selected when its fee has been configured and the option is available.",
        ],
      ],
      [
        "Upload through your order",
        [
          "After submitting a customer-supplied artwork order, open its artwork link. Upload the file against the correct item so it stays connected to the job.",
          "The current upload accepts PDF, JPG/JPEG, PNG and WebP files up to 20 MB each. Native design files such as PSD or AI are not accepted by this uploader. Export a suitable file or contact us before sending another format.",
          "Check the wording, orientation, intended print size and placement. Tell us about any special requirements in the order instructions. A successful upload means the file was received, not that it has been approved for production.",
        ],
      ],
      [
        "Respond to artwork feedback",
        [
          "If a file needs changes, read the review note on your order, make the requested correction and upload the replacement through the same order.",
          "Final pricing and production depend on the approvals required for that item. Do not assume an email attachment or WhatsApp preview has replaced the file saved on your order.",
        ],
      ],
      [
        "Check jersey spelling before submitting",
        [
          "Enter the printed name exactly as you want it produced, including capitalisation. Leading and trailing spaces are removed.",
          "Check names, numbers, size and kit in the order summary. If you spot a mistake after submission, contact us immediately with the order reference. Changes need to be confirmed before work proceeds.",
        ],
      ],
    ],
    links: [
      ["Find my artwork request", "/shop/order"],
      ["Order a jersey", "/shop/jerseys"],
    ],
  },
  {
    slug: "payments",
    title: "Payments & receipts",
    summary:
      "Use the confirmed total, bank instructions and reference shown on your own order.",
    sections: [
      [
        "Get the correct bank details",
        [
          "Open My orders, select the order and follow its payment link after final pricing has been confirmed. Choose Get bank details when the option appears.",
          "Use the bank name, account name, account number, payment reference and amount displayed for that order. This Help page does not publish a separate account number.",
          "If the total or instructions look wrong, contact us before transferring. If you already paid, do not make a second transfer just because the page shows an error.",
        ],
      ],
      [
        "Submit your transfer receipt",
        [
          "After transferring, use the receipt submission form on the payment page. Enter the requested sender and transfer details and attach a legible receipt.",
          "The receipt uploader accepts PDF, JPG/JPEG, PNG and WebP files up to 10 MB each. Keep the amount, date and transaction reference visible.",
          "A submitted receipt is awaiting verification. It is not the same as a verified payment, and production starts only after the matching payment is verified and the applicable approvals are complete.",
        ],
      ],
      [
        "If the receipt needs correction",
        [
          "Read the review note if a receipt is rejected. Check the amount, transfer information and file, then follow the options on your order to resubmit.",
          "If money left your account but the order is not confirmed, contact us with the order reference and transfer details. Do not pay again while the first transfer is being checked.",
          "For a page error, include the exact message and order reference. Never send your password, PIN or one-time security code.",
        ],
      ],
    ],
    links: [["Open my order payment", "/shop/order"]],
  },
  {
    slug: "delivery",
    title: "Delivery & pickup",
    summary:
      "Delivery charges and handover arrangements are confirmed for each order.",
    sections: [
      [
        "Choose delivery or pickup",
        [
          "Choose your preferred method when placing the order. For delivery, provide an accurate state, city, street address, recipient name and reachable phone number.",
          "Your account lets you save a delivery address. Always check the address recorded on the individual order; changing a saved address does not automatically change an order already submitted.",
          "Delivery availability and charges depend on the order and destination. Use the confirmed order total rather than assuming the product price includes delivery.",
        ],
      ],
      [
        "Wait for the ready update",
        [
          "Ready means production is complete. Check your order and notifications for the next arrangements.",
          "For pickup, confirm the collection location, time and any person collecting on your behalf with us before travelling. This page does not publish a walk-in collection address.",
          "For delivery, check the carrier or tracking information if it has been added. We do not promise a dispatch or arrival date that has not been confirmed for your order.",
        ],
      ],
      [
        "Correct an address or report a problem",
        [
          "Contact us with the order reference as soon as you notice an incorrect address or phone number. We must confirm whether the change can still be made.",
          "If the parcel has already been dispatched, a change may depend on the carrier and the stage of delivery. Contact us rather than creating a new order.",
          "For a missing or damaged parcel, send the reference, a description of the issue and relevant photos so we can review the handover.",
        ],
      ],
    ],
    links: [
      ["Manage delivery address", "/shop/account/address"],
      ["Check my order", "/shop/order"],
    ],
  },
  {
    slug: "cancel-order",
    title: "Changes & cancellations",
    summary:
      "Contact us promptly with your order reference. A request needs confirmation from NewJersey.",
    sections: [
      [
        "Tell us exactly what needs changing",
        [
          "Include the order reference, the affected product and the corrected details. For a jersey, specify the team, kit, size, printed name or number that needs changing.",
          "For Custom printing, identify the artwork or specification being replaced. Use the order artwork area for replacement files when an upload is requested.",
          "For delivery changes, include the corrected address and phone number. Editing your account alone does not update an existing order.",
        ],
      ],
      [
        "The order stage matters",
        [
          "We will check the current stage and tell you whether the requested change or cancellation can be made. A message requesting a change does not mean it has been applied.",
          "Once artwork or specifications have been approved and work has started, changes may no longer be possible. Additional work, materials or delivery arrangements may need to be discussed.",
          "The current account area does not offer a self-service cancellation button. Contact support rather than submitting another order to replace the first one.",
        ],
      ],
      [
        "If you have already paid",
        [
          "Tell us whether payment has been made and include the order reference. We will review the request alongside payment and production records.",
          "Any applicable adjustment or refund must be confirmed after review. This page does not promise automatic cancellation or a fixed refund outcome.",
        ],
      ],
    ],
    links: [["Check my order stage", "/shop/order"]],
  },
  {
    slug: "returns-refunds",
    title: "Problems, returns & refunds",
    summary:
      "Report a problem with the order reference and clear evidence so we can review what happened.",
    sections: [
      [
        "Send the details we need",
        [
          "Tell us the order reference, the product and quantity affected, and what differs from the order you received.",
          "For a print or personalisation issue, include clear photos of the full item and the affected area. For delivery damage, include photos of the packaging where available.",
          "For a payment issue, include the transfer date, amount and transaction reference. Do not share banking passwords, PINs or security codes.",
        ],
      ],
      [
        "We compare the item with the order",
        [
          "We will review the saved size, colour, artwork or personalisation instructions and the relevant production or payment records.",
          "Ready-designed Apparel, Custom printing and personalised Jerseys have different order details. Explain whether the issue concerns the product supplied, the printing, the approved instructions or delivery.",
          "Contact us before sending an item back. We need to confirm any return destination and the next steps for your case.",
        ],
      ],
      [
        "Resolution follows review",
        [
          "We will confirm the available resolution after checking the issue. Do not assume a refund has been approved until we confirm it.",
          "If your request concerns a return or refund, we will explain the applicable steps and any confirmed timing when we respond. Keep the order reference and our correspondence together.",
        ],
      ],
    ],
    links: [["Find my order reference", "/shop/order"]],
  },
];
