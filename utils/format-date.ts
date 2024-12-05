export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).format(date)
  }
  