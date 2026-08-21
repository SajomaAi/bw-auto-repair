# Estimate Templates — B&W Auto Repair LLC

Customer-facing templates for sending estimates. Two channels — email (via QuickBooks)
and text. Placeholders are in `{{DOUBLE_BRACES}}` — fill every one before sending.

Shop contact block used throughout:
`609.362.5476` · `bw_autorepair@hotmail.com` · `bwautorepairllc.com`

---

## 1. Email template (English)

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

## 2. Text template (English)

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

## 3. Email template (Spanish)

Same mechanics as the English version: this is the *message* body of a QuickBooks send.
Uses the `usted` form throughout, which is what a customer expects from a business.

### Subject

```
Su estimado de B&W Auto Repair — {{YEAR_MAKE_MODEL}} (Estimado #{{ESTIMATE_NO}})
```

### Body

```
Hola {{FIRST_NAME}}:

Gracias por traernos su {{YEAR_MAKE_MODEL}}. Aquí está el estimado del
trabajo que conversamos:

{{WORK_SUMMARY_ES}}

Total del estimado: ${{TOTAL}}

El desglose completo — piezas y mano de obra, línea por línea — viene
adjunto, y puede revisarlo y aprobarlo con el botón de arriba. No pedimos
ninguna pieza ni empezamos ningún trabajo hasta que usted nos dé el visto
bueno.

Dos cosas que vale la pena saber:

- Este estimado es válido por 30 días. Después de esa fecha el precio de
  las piezas puede cambiar.
- Si al abrir encontramos algo que no se veía por fuera, paramos y lo
  llamamos primero. Usted no va a recibir una factura con sorpresas.

¿Tiene preguntas, o quiere que le expliquemos qué es urgente y qué puede
esperar? Llámenos o mándenos un mensaje de texto al 609.362.5476 — con
gusto se lo explicamos.

Gracias,
B&W Auto Repair LLC
609.362.5476 | bw_autorepair@hotmail.com
bwautorepairllc.com
```

**A note on the word "estimado":** that is the term US shops use and the one your
customers will recognize. `presupuesto` and `cotización` are more standard in Latin
America and Spain — swap if a particular customer seems to expect it.

---

## 4. Text template (Spanish)

### Standard version

```
¡Hola {{FIRST_NAME}}! Su estimado de B&W Auto Repair para el {{YEAR_MAKE_MODEL}}
está listo — {{WORK_SHORT_ES}}, ${{TOTAL}} en total. Le enviamos el desglose
completo a {{EMAIL}}; puede aprobarlo desde ese correo. ¿Preguntas? Llame al
609.362.5476. Responda STOP para no recibir más mensajes.
```

### Short version

```
¡Hola {{FIRST_NAME}}! Su estimado de B&W Auto Repair para el {{VEHICLE_SHORT}}
es ${{TOTAL}}. El desglose está en su correo. ¿Preguntas? 609.362.5476
```

**Keep the opt-out keyword as `STOP`, in English.** That is the keyword carriers
actually process; a translated word will not register as an opt-out.

**Spanish texts cost more segments.** A plain English SMS fits 160 characters per
segment. The accented characters `á í ó ú` are not in the GSM-7 character set, so any
message containing them switches to UCS-2 encoding, where a segment is **70 characters**.
Both Spanish versions above will send as multiple segments. That is normal and delivers
fine — just expect it on the bill, and do not strip the accents to save space, because
unaccented Spanish reads as careless.

---

## 5. Filling the placeholders

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
| `{{WORK_SUMMARY_ES}}` | Spanish recap of the line items | `Reemplazar los dos convertidores catalíticos, delantero y trasero` |
| `{{WORK_SHORT_ES}}` | Few-word Spanish version for SMS | `convertidores catalíticos` |

Write `{{WORK_SUMMARY}}` in customer language, not shop language. The QuickBooks line
items say "Upper catalytic converter replacement"; the summary should say what that
means for the car and why it matters.

---

## 6. Customers with no email on file

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
