import * as transform from '../utils/jsonApiUtils.js';
import * as api from '../utils/api';
import * as constants from './constants';

const createOrganizationMember = (organizationId, userId) => {
  return (dispatch) => {
    api.postJson('/api/organization_members',
      {
        organization_member: { organization_id: organizationId, member_id: userId },
      },
      (json) => {
        const organizationMember = transform.transformObjectFromJsonApi(json.data);

        dispatch({
          type: constants.CREATE_ORGANIZATION_MEMBER,
          status: constants.STATUS_SUCCESS,
          organizationMember,
          entity: organizationMember,
        });
      });
  };
};

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
  createOrganizationMember,
  deleteOrganizationMember,
};
