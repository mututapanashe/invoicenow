import { formatMoney } from '@/lib/account-settings'
import { AccountSettings, Invoice } from '@/types'

type InvoicePdfPayload = {
  invoice: Invoice
  settings: AccountSettings
}

const escapePdfText = (value: string) =>
  value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')

const toPdfDate = (value: string) => {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

const toPdfStatus = (status: Invoice['status']) => status.charAt(0).toUpperCase() + status.slice(1)

const createPdfDocument = (lines: string[]) => {
  let y = 790
  const commands: string[] = ['BT', '/F1 12 Tf']

  for (const line of lines) {
    commands.push(`1 0 0 1 48 ${y} Tm`)
    commands.push(`(${escapePdfText(line)}) Tj`)
    y -= 20
  }

  commands.push('ET')
  const stream = commands.join('\n')
  const streamLength = new TextEncoder().encode(stream).length

  const objects = [
    `1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj`,
    `2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj`,
    `3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj`,
    `4 0 obj
<< /Length ${streamLength} >>
stream
${stream}
endstream
endobj`,
    `5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj`,
  ]

  let body = '%PDF-1.4\n'
  const offsets = [0]

  for (const object of objects) {
    offsets.push(body.length)
    body += `${object}\n`
  }

  const xrefStart = body.length
  body += `xref
0 ${objects.length + 1}
0000000000 65535 f 
`

  for (let i = 1; i <= objects.length; i += 1) {
    body += `${String(offsets[i]).padStart(10, '0')} 00000 n 
`
  }

  body += `trailer
<< /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${xrefStart}
%%EOF`

  return new TextEncoder().encode(body)
}

export const buildInvoicePdf = ({ invoice, settings }: InvoicePdfPayload) => {
  const invoiceDate = invoice.createdAt ? toPdfDate(invoice.createdAt) : toPdfDate(new Date().toISOString())
  const dueDate = toPdfDate(invoice.dueDate)
  const amount = formatMoney(invoice.amount, settings.defaultCurrency)

  const lines = [
    settings.companyName || 'Invoice',
    settings.companyAddress || '',
    settings.companyEmail ? `Email: ${settings.companyEmail}` : '',
    settings.companyPhone ? `Phone: ${settings.companyPhone}` : '',
    '',
    `Invoice ID: ${invoice.id}`,
    `Invoice Date: ${invoiceDate}`,
    `Due Date: ${dueDate}`,
    `Status: ${toPdfStatus(invoice.status)}`,
    '',
    `Bill To: ${invoice.customerName}`,
    `Customer Email: ${invoice.customerEmail}`,
    '',
    `Total Due (${settings.defaultCurrency}): ${amount}`,
  ].filter(Boolean)

  return createPdfDocument(lines)
}
