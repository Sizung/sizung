import * as transform from '../utils/jsonApiUtils.js';
import * as api from '../utils/api';
import * as constants from './constants';

const inviteOrganizationMember = (organizationId, email) => {
  return (dispatch) => {
    api.postJson('/api/organization_members/', { organization_id: organizationId, email: email }, (json) => {
      if (json.errorMessage && json.errorMessage.trim() !== '') {
        alert(json.errorMessage);
      } else {
        const organizationMember = transform.transformObjectFromJsonApi(json.data);
        const entities = json.included.map(transform.transformObjectFromJsonApi);
        dispatch({
          type: constants.INVITE_ORGANIZATION_MEMBER,
          status: constants.STATUS_SUCCESS,
          organizationMember,
          entity: organizationMember,
          entities,
        });
      }
    });
  };
};

const createOrganizationMemberRemoteOrigin = (organizationMember, includedEntities) => {
  return {
    type: constants.CREATE_ORGANIZATION_MEMBER,
    verb: constants.CREATE,
    status: constants.STATUS_REMOTE_ORIGIN,
    organizationMember,
    entity: organizationMember,
    entities: includedEntities,
  }
}

const deleteOrganizationMember = (id) => {
  if (confirm("Are you sure you want to remove this organization member?")) {
    return (dispatch) => {
      api.deleteJson('/api/organization_members/' + id, (json) => {
        const organizationMember = transform.transformObjectFromJsonApi(json.data);

        dispatch({
          type: constants.DELETE_ORGANIZATION_MEMBER,
          verb: constants.DELETE,
          status: constants.STATUS_SUCCESS,
          organizationMember,
          entity: organizationMember,
        });
      });
    };
  }
};

export {
  inviteOrganizationMember,
  createOrganizationMemberRemoteOrigin,
  deleteOrganizationMember,
};
