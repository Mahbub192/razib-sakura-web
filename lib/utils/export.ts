/**
 * Export Utility Functions
 * Handles PDF and Excel export functionality
 */

export interface ExportData {
  title: string
  headers: string[]
  rows: (string | number)[][]
  dateRange?: string
}

export const exportUtils = {
  // Export to PDF (using browser print functionality)
  async exportToPDF(data: ExportData): Promise<void> {
    // Create a temporary HTML table for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to export PDF')
      return
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4f46e5; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .date-range { color: #666; margin-bottom: 10px; }
            @media print {
              body { padding: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <h1>${data.title}</h1>
          ${data.dateRange ? `<div class="date-range">${data.dateRange}</div>` : ''}
          <table>
            <thead>
              <tr>
                ${data.headers.map((header) => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
      // Close window after printing
      setTimeout(() => printWindow.close(), 100)
    }, 250)
  },

  // Export to Excel (CSV format)
  exportToExcel(data: ExportData, filename?: string): void {
    // Create CSV content
    const csvContent = [
      data.title,
      data.dateRange || '',
      '',
      data.headers.join(','),
      ...data.rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', filename || `${data.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
  },

  // Export reports data
  exportReports(data: {
    title: string
    metrics: Array<{ label: string; value: string | number }>
    appointments?: Array<{
      date: string
      patient: string
      type: string
      status: string
    }>
    demographics?: Array<{ category: string; count: number; percentage: number }>
    dateRange: string
  }, format: 'pdf' | 'excel'): void {
    const headers = ['Metric', 'Value']
    const rows = data.metrics.map((m) => [m.label, m.value])

    if (data.appointments && data.appointments.length > 0) {
      rows.push(['', '']) // Empty row
      rows.push(['Appointments', ''])
      rows.push(['Date', 'Patient', 'Type', 'Status'])
      data.appointments.forEach((apt) => {
        rows.push([apt.date, apt.patient, apt.type, apt.status])
      })
    }

    if (data.demographics && data.demographics.length > 0) {
      rows.push(['', '']) // Empty row
      rows.push(['Demographics', ''])
      rows.push(['Category', 'Count', 'Percentage'])
      data.demographics.forEach((demo) => {
        rows.push([demo.category, demo.count, `${demo.percentage}%`])
      })
    }

    const exportData: ExportData = {
      title: data.title,
      headers,
      rows,
      dateRange: data.dateRange,
    }

    if (format === 'pdf') {
      this.exportToPDF(exportData)
    } else {
      this.exportToExcel(exportData)
    }
  },
}

