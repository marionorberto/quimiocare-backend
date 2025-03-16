export enum EnumAppointmentType {
  GENERAL = 'Consulta Médica Geral',
  ONCOLOGY = 'Consulta Oncológica',
  PSYCHOLOGY = 'Consulta Psicológica',
  NUTRITION = 'Consulta Nutricional',
  RADIOTHERAPY = 'Consulta de Radioterapia',
  CHEMOTHERAPY = 'Consulta de Quimioterapia',
  EXAMS = 'Consulta de Exames',
  PALLIATIVE = 'Consulta Paliativa',
  SURGICAL = 'Consulta Cirúrgica',
  PHYSIOTHERAPY = 'Consulta de Fisioterapia',
}

export enum EnumAppointmentStatus {
  PENDING = 'Pendente',
  CONFIRMED = 'Confirmada',
  CANCELED = 'Cancelada',
  RESCHEDULED = 'Remarcada',
  IN_PROGRESS = 'Em andamento',
  COMPLETED = 'Concluída',
  NO_SHOW = 'Faltou',
}
