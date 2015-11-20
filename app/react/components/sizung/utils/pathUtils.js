const agendaItemIdPathMatcher = /.*\/agenda_items\/([a-zA-Z0-9-]+).*$/;
const deliverableIdPathMatcher = /.*\/deliverables\/([a-zA-Z0-9-]+).*$/;

export function getPath(state) {
  return state.get('routing').path;
}

export function getAgendaItemIdFromPath(path) {
  const result = agendaItemIdPathMatcher.exec(path);
  return result ? result[1] : null;
}

export function getDeliverableIdFromPath(path) {
  const result = deliverableIdPathMatcher.exec(path);
  return result ? result[1] : null;
}
