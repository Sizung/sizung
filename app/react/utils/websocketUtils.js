const followUserChannel = (currentUserId, onUserChannelReceived) => {
  window.App.userChannel.followUser(currentUserId);
  window.App.userChannel.setOnReceived(onUserChannelReceived);
};

const unfollowUserChannel = () => {
  window.App.userChannel.unfollowCurrentUser();
};

const followConversationChannel = (conversationId, currentUserId, onConversationChannelReceived) => {
  window.App.conversationChannel.followConversation(conversationId);
  window.App.conversationChannel.setOnReceived((data) => {
    onConversationChannelReceived(data, currentUserId);
  });
};

const unfollowConversationChannel = () => {
  window.App.conversationChannel.unfollowConversation();
};

const followOrganizationChannel = (organizationId, onOrganizationChannelReceived) => {
  window.App.organizationChannel.followOrganization(organizationId);
  window.App.organizationChannel.setOnReceived(onOrganizationChannelReceived);
};

const unfollowOrganizationChannel = () => {
  window.App.organizationChannel.unfollowOrganization();
};

export {
  followUserChannel,
  unfollowUserChannel,
  followConversationChannel,
  unfollowConversationChannel,
  followOrganizationChannel,
  unfollowOrganizationChannel,
}