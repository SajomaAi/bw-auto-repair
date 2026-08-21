# Estimate Templates — B&W Auto Repair LLC

Customer-facing templates for sending estimates. Two channels: email (via QuickBooks)
and text. Placeholders are in `{{DOUBLE_BRACES}}` — fill every one before sending.

Shop contact block used throughout:
`609.362.5476` · `bw_autorepair@hotmail.com` · `bwautorepairllc.com`

---

## 1. Email template

**How this gets sent:** paste the body below into the *message* field when sending
the estimate from QuickBooks (Save and send), or hand it to Claude to send. QuickBooks
wraps your message with its own branded header, the estimate PDF, and a review/approve
link that takes the customer to their estimate. **Do not paste a link into the body
yourself** — the working customer link is the one QuickBooks generates. (The `link`
field stored on the estimate record is an internal QuickBooks login URL and will not
open for a customer.)

**BCC:** `bw_autorepair@hotmail.com` on every send, so the shop has a record it went out.

### Subject

```
Your estimate from B&W Auto Repair — {{YEAR_MAKE_MODEL}} (Estimate #{{ESTIMATE_NO}})
```

### Body

```
Hi {{FIRST_NAME}},

Thanks for bringing your {{YEAR_MAKE_MODEL}} in. Here's the estimate for the
work we talked about:

{{WORK_SUMMARY}}

Estimate total: ${{TOTAL}}

The full line-by-line breakdown — parts and labor — is attached, and you can
review and approve it using the button above. Nothing gets ordered and no work
starts until you give us the go-ahead.

A couple of things worth knowing:

- This estimate is good for 30 days. Parts pricing can move after that.
- If we open things up and find a problem we couldn't see from the outside,
  we stop and call you first. You will not get a bill with surprises on it.

Questions, or want to talk through what's urgent versus what can wait? Call or
text us at 609.362.5476 — happy to walk you through it.

Thanks,
B&W Auto Repair LLC
609.362.5476 | bw_autorepair@hotmail.com
bwautorepairllc.com
```

---

## 2. Text template

Estimates are a **Service Update** under the SMS terms at `/sms-consent.html`, so they
go only to customers who have consented. Voice matches the existing message examples
on that page.

### Standard version

```
Hi {{FIRST_NAME}}! Your estimate from B&W Auto Repair for the {{YEAR_MAKE_MODEL}}
is ready — {{WORK_SHORT}}, ${{TOTAL}} total. We emailed the full breakdown to
{{EMAIL}}; you can approve it right from that email. Questions? Call 609.362.5476.
Reply STOP to opt out.
```

### Short version (one SMS segment, under 160 characters)

```
Hi {{FIRST_NAME}}! Your B&W Auto Repair estimate for the {{VEHICLE_SHORT}} is
${{TOTAL}}. Full breakdown is in your email. Questions: 609.362.5476
```

Use the short version when the customer already knows an estimate is coming. Check the
character count after filling placeholders — going over 160 splits into two segments,
which some carriers deliver out of order.

**On links in texts:** there is no customer-facing estimate URL that can be generated
outside of QuickBooks' own email, so the text points to the email rather than linking
directly. If you copy a shareable link out of QuickBooks by hand, drop it in place of
"in your email."

---

## 3. Filling the placeholders

| Placeholder | Where it comes from | Example |
|---|---|---|
| `{{FIRST_NAME}}` | Customer display name in QuickBooks | `Vijay` |
| `{{YEAR_MAKE_MODEL}}` | Work order / intake | `2018 Honda Accord` |
| `{{VEHICLE_SHORT}}` | Shortened for SMS | `Accord` |
| `{{ESTIMATE_NO}}` | Estimate reference number | `1244` |
| `{{WORK_SUMMARY}}` | Plain-language recap of the line items | `Replace both catalytic converters, front and rear` |
| `{{WORK_SHORT}}` | Few-word version for SMS | `catalytic converters` |
| `{{TOTAL}}` | Estimate total | `1,187.58` |
| `{{EMAIL}}` | Customer email on the estimate | `svpatel5311@gmail.com` |

Write `{{WORK_SUMMARY}}` in customer language, not shop language. The QuickBooks line
items say "Upper catalytic converter replacement"; the summary should say what that
means for the car and why it matters.

---

## 4. Customers with no email on file

Four estimates currently have no email address, so the email template cannot reach them
and the text template's "check your email" line does not apply:

| Estimate | Customer | Note |
|---|---|---|
| 1223 | Robin D Villegas | No email anywhere in QuickBooks |
| 1222 | Bertha P Carchipulla Guaman | No email anywhere in QuickBooks |
| 1209 | Niari Santiago | No email anywhere in QuickBooks |
| 1219 | Enrique Porras | Address *is* known — `enriqueporras90@gmail.com`, on estimates 1220 and 1216. Just missing from 1219. |

For the first three, add an email in QuickBooks before sending, or reach them by phone.
For 1219, copy the address onto the estimate and it can go out normally.
