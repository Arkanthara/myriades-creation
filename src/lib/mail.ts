export type ContactLabels = {
  mailGreeting: string;
  mailName: string;
  mailEmail: string;
  mailProject: string;
  mailCreation: string;
};
export type ContactInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
  creation?: string;
};
export function buildContactBody(input: ContactInput, labels: ContactLabels): string {
  return [
    labels.mailGreeting,
    '',
    `${labels.mailName} : ${input.name.trim()}`,
    `${labels.mailEmail} : ${input.email.trim()}`,
    `${labels.mailProject} : ${input.subject.trim()}`,
    ...(input.creation?.trim() ? [`${labels.mailCreation} : ${input.creation.trim()}`] : []),
    '',
    input.message.trim(),
  ].join('\n');
}
export function buildMailto(email: string, subject: string, body: string): string {
  if (!email || /[\r\n?&#]/.test(email)) throw new Error('Adresse e-mail invalide.');
  return `mailto:${email}?subject=${encodeURIComponent(subject.replace(/[\r\n]/g, ' '))}&body=${encodeURIComponent(body)}`;
}
export type OrderFields = {
  mailGreeting: string;
  measurementsLabel: string;
  optionsLabel: string;
  notesLabel: string;
  unit: string;
  measurements: { id: string; label: string }[];
  options: { id: string; label: string; choices: string[] }[];
};
export function buildOrderBody(values: Record<string, string>, config: OrderFields): string {
  const measurements = config.measurements.flatMap((field) =>
    values[field.id]?.trim() ? [`${field.label} : ${values[field.id]} ${config.unit}`] : [],
  );
  const options = config.options.flatMap((field) =>
    field.choices.includes(values[field.id]) ? [`${field.label} : ${values[field.id]}`] : [],
  );
  return [
    config.mailGreeting,
    '',
    config.measurementsLabel,
    ...measurements,
    '',
    config.optionsLabel,
    ...options,
    '',
    config.notesLabel,
    values.notes?.trim() || '',
  ].join('\n');
}
