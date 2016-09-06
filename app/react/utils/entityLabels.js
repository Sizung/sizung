import * as selectors from '../utils/selectors'

const isOrganizationOfTypeClosingMatrix = (organization) => {
  if (organization && organization.name) {
    //return ((organization.name.toLowerCase()).indexOf('closing matrix by sizung') > -1);
    return true;
  }
  return '';
};

const agendaItemLabel = (organization) => {
  if (organization) {
    return (isOrganizationOfTypeClosingMatrix(organization) ? 'CLOSING ITEM' : 'AGENDA');
  }
  return '';
};

const deliverableLabel = (organization) => {
  if (organization) {
    return (isOrganizationOfTypeClosingMatrix(organization) ? 'REVIEW' : 'ACTION');
  }
  return '';
};

const conversationLabel = (organization) => {
  if (organization) {
    return 'TEAMS';
  }
  return '';
};

const agendaItemInputPlaceholder = (organization) => {
  if (organization) {
    return (isOrganizationOfTypeClosingMatrix(organization) ? 'Enter title of closing item' : 'What would you like to discuss?');
  }
  return '';
};

const deliverableInputPlaceholder = (organization) => {
  if (organization) {
    return 'What needs to be done?';
  }
  return '';
};

const commentInputPlaceholder = (organization) => {
  if (organization) {
    return 'Write a comment here';
  }
  return '';
};

const organizationObjectsLabels = (state) => {
  const currentOrganization = selectors.currentOrganization(state);
  const labels = {
    agendaItemLabel: agendaItemLabel(currentOrganization),
    deliverableLabel: deliverableLabel(currentOrganization),
    conversationLabel: conversationLabel(currentOrganization),
    agendaItemInputPlaceholder: agendaItemInputPlaceholder(currentOrganization),
    deliverableInputPlaceholder: deliverableInputPlaceholder(currentOrganization),
    commentInputPlaceholder: commentInputPlaceholder(currentOrganization),
  };
  return labels;
};

export {
    organizationObjectsLabels,
};
